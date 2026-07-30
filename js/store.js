/* ============================================================================
   store.js  —  Warstwa stanu (localStorage)
   Jedno miejsce prawdy dla: katalogu, kategorii, koszyka, zamówień, wiadomości.
   Emituje zdarzenia ("cart", "catalog"), na które reagują widoki.
   ========================================================================== */

const Store = (() => {
  const KEYS = {
    products: "ps_products",
    categories: "ps_categories",
    cart: "ps_cart",
    orders: "ps_orders",
    messages: "ps_messages",
    theme: "ps_theme",
    seeded: "ps_seeded_v2",
  };

  const listeners = { cart: [], catalog: [], orders: [], messages: [] };

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("Store read error", key, e);
      return fallback;
    }
  };
  const write = (key, val) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn("Store write error", key, e);
    }
  };

  const emit = (channel) => (listeners[channel] || []).forEach((fn) => fn());
  const on = (channel, fn) => {
    (listeners[channel] = listeners[channel] || []).push(fn);
    return () => {
      listeners[channel] = listeners[channel].filter((f) => f !== fn);
    };
  };

  /* ---- Seed --------------------------------------------------------------- */
  function seedIfNeeded() {
    if (!localStorage.getItem(KEYS.seeded)) {
      write(KEYS.products, DEFAULT_PRODUCTS);
      write(KEYS.categories, DEFAULT_CATEGORIES);
      localStorage.setItem(KEYS.seeded, "1");
    }
  }
  function resetCatalog() {
    write(KEYS.products, DEFAULT_PRODUCTS);
    write(KEYS.categories, DEFAULT_CATEGORIES);
    emit("catalog");
  }

  /* ---- Katalog ------------------------------------------------------------ */
  // Katalog „na żywo" z Shopify (headless). Gdy ustawiony — ma pierwszeństwo
  // przed lokalnym seedem. Reszta aplikacji nie musi wiedzieć, skąd pochodzi.
  let liveProducts = null;
  function setCatalog(products) {
    liveProducts = Array.isArray(products) && products.length ? products : null;
    emit("catalog");
  }
  const getProducts = () => liveProducts || read(KEYS.products, []);
  const getProduct = (id) => getProducts().find((p) => p.id === id) || null;
  const getCategories = () => read(KEYS.categories, []);
  const getCategory = (slug) => getCategories().find((c) => c.slug === slug) || null;

  function upsertProduct(prod) {
    const list = getProducts();
    const idx = list.findIndex((p) => p.id === prod.id);
    if (idx >= 0) list[idx] = prod;
    else list.unshift(prod);
    write(KEYS.products, list);
    emit("catalog");
  }
  function deleteProduct(id) {
    write(KEYS.products, getProducts().filter((p) => p.id !== id));
    emit("catalog");
  }
  function slugify(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "poster-" + Date.now();
  }

  /* ---- Koszyk -------------------------------------------------------------
     Pozycja: { id, size, qty }  (id = productId; wariant identyfikowany id+size)
     ------------------------------------------------------------------------ */
  const getCart = () => read(KEYS.cart, []);
  const cartCount = () => getCart().reduce((n, i) => n + i.qty, 0);

  function cartLines() {
    return getCart()
      .map((item) => {
        const p = getProduct(item.id);
        if (!p) return null;
        const unit = (p.prices && p.prices[item.size]) || 0;
        return { ...item, product: p, unit, lineTotal: unit * item.qty };
      })
      .filter(Boolean);
  }
  const cartSubtotal = () => cartLines().reduce((s, l) => s + l.lineTotal, 0);

  function addToCart(id, size, qty = 1) {
    const cart = getCart();
    const found = cart.find((i) => i.id === id && i.size === size);
    if (found) found.qty += qty;
    else cart.push({ id, size, qty });
    write(KEYS.cart, cart);
    emit("cart");
  }
  function setQty(id, size, qty) {
    let cart = getCart();
    const item = cart.find((i) => i.id === id && i.size === size);
    if (!item) return;
    item.qty = qty;
    if (item.qty <= 0) cart = cart.filter((i) => !(i.id === id && i.size === size));
    write(KEYS.cart, cart);
    emit("cart");
  }
  function removeFromCart(id, size) {
    write(KEYS.cart, getCart().filter((i) => !(i.id === id && i.size === size)));
    emit("cart");
  }
  function clearCart() {
    write(KEYS.cart, []);
    emit("cart");
  }

  /* ---- Zamówienia (mock checkout) ----------------------------------------- */
  const getOrders = () => read(KEYS.orders, []);
  function createOrder(customer, shipping) {
    const lines = cartLines();
    if (!lines.length) return null;
    const subtotal = cartSubtotal();
    const order = {
      number: "PS-" + Date.now().toString().slice(-6),
      createdAt: new Date().toISOString(),
      customer,
      shipping,
      items: lines.map((l) => ({
        id: l.id, title: l.product.title, size: l.size,
        qty: l.qty, unit: l.unit, lineTotal: l.lineTotal,
      })),
      subtotal,
      shippingCost: shipping,
      total: subtotal + shipping,
      status: "Nowe",
    };
    const orders = getOrders();
    orders.unshift(order);
    write(KEYS.orders, orders);
    emit("orders");
    return order;
  }

  const ORDER_STATUSES = ["Nowe", "W realizacji", "Wysłane", "Zrealizowane", "Anulowane"];
  function updateOrderStatus(number, status) {
    const orders = getOrders();
    const o = orders.find((x) => x.number === number);
    if (!o) return false;
    o.status = status;
    write(KEYS.orders, orders);
    emit("orders");
    return true;
  }

  /* ---- Wiadomości z formularza kontaktowego -------------------------------- */
  const getMessages = () => read(KEYS.messages, []);
  function addMessage(msg) {
    const messages = getMessages();
    messages.unshift({ ...msg, createdAt: new Date().toISOString(), read: false });
    write(KEYS.messages, messages);
    emit("messages");
  }
  function markMessagesRead() {
    write(KEYS.messages, getMessages().map((m) => ({ ...m, read: true })));
    emit("messages");
  }
  function replyToMessage(createdAt, reply) {
    const messages = getMessages();
    const m = messages.find((x) => x.createdAt === createdAt);
    if (!m) return false;
    m.reply = reply;
    m.repliedAt = new Date().toISOString();
    m.read = true;
    write(KEYS.messages, messages);
    emit("messages");
    return true;
  }

  /* ---- Motyw -------------------------------------------------------------- */
  const getTheme = () => localStorage.getItem(KEYS.theme) || "auto";
  const setTheme = (t) => localStorage.setItem(KEYS.theme, t);

  return {
    SIZES, KEYS,
    seedIfNeeded, resetCatalog, slugify,
    getProducts, getProduct, setCatalog, getCategories, getCategory, upsertProduct, deleteProduct,
    getCart, cartCount, cartLines, cartSubtotal, addToCart, setQty, removeFromCart, clearCart,
    getOrders, createOrder, updateOrderStatus, ORDER_STATUSES,
    getMessages, addMessage, markMessagesRead, replyToMessage,
    getTheme, setTheme,
    on,
  };
})();
