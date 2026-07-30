/* ============================================================================
   components.js  —  Wspólne UI: ikony, formatowanie, nav, stopka, koszyk,
   karty produktów, toasty, animacje wejścia.
   Ikony: spójny, minimalny zestaw inline (stroke 1.6) — bez zależności.
   ========================================================================== */

const UI = (() => {
  /* ---- Ikony (spójny zestaw, dopasowany do lekkiego, editorial stylu) ---- */
  const I = (paths, o = {}) =>
    `<svg width="${o.s || 20}" height="${o.s || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${o.w || 1.6}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

  const icons = {
    menu: (o) => I('<path d="M3 6h18M3 12h18M3 18h18"/>', o),
    cart: (o) => I('<path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/>', o),
    bag: (o) => I('<path d="M6 8h12l1 12H5z"/><path d="M9 8a3 3 0 0 1 6 0"/>', o),
    x: (o) => I('<path d="M18 6 6 18M6 6l12 12"/>', o),
    plus: (o) => I('<path d="M12 5v14M5 12h14"/>', o),
    minus: (o) => I('<path d="M5 12h14"/>', o),
    arrowRight: (o) => I('<path d="M5 12h14M13 6l6 6-6 6"/>', o),
    arrowLeft: (o) => I('<path d="M19 12H5M11 18l-6-6 6-6"/>', o),
    arrowUpRight: (o) => I('<path d="M7 17 17 7M8 7h9v9"/>', o),
    check: (o) => I('<path d="M20 6 9 17l-5-5"/>', o),
    sun: (o) => I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>', o),
    moon: (o) => I('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>', o),
    mail: (o) => I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', o),
    phone: (o) => I('<path d="M4 4h4l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z"/>', o),
    pin: (o) => I('<path d="M12 21s7-6.4 7-11a7 7 0 0 0-14 0c0 4.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/>', o),
    truck: (o) => I('<rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/>', o),
    shield: (o) => I('<path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>', o),
    sparkle: (o) => I('<path d="M12 3v18M3 12h18M6 6l12 12M18 6 6 18"/>', o),
    palette: (o) => I('<path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9z"/><circle cx="7.5" cy="12" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="15" cy="7.5" r="1"/>', o),
    frame: (o) => I('<rect x="4" y="3" width="16" height="18" rx="1"/><rect x="8" y="7" width="8" height="10" rx="0.5"/>', o),
    leaf: (o) => I('<path d="M4 20c8 0 16-4 16-16C10 4 4 10 4 20z"/><path d="M4 20c4-6 8-8 12-9"/>', o),
    instagram: (o) => I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.4"/><circle cx="17" cy="7" r="1"/>', o),
    trash: (o) => I('<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/>', o),
    edit: (o) => I('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>', o),
    search: (o) => I('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', o),
    lock: (o) => I('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', o),
    image: (o) => I('<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/>', o),
    chevron: (o) => I('<path d="m6 9 6 6 6-6"/>', o),
    info: (o) => I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>', o),
    box: (o) => I('<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>', o),
    grid: (o) => I('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', o),
    dashboard: (o) => I('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>', o),
    logout: (o) => I('<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 12H3M6 8l-4 4 4 4"/>', o),
  };

  /* ---- Formatowanie ------------------------------------------------------ */
  const pln = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const money = (n) => pln.format(n || 0);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- Pomocnicze -------------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const priceFrom = (p) => Math.min(...Object.values(p.prices || { A4: 0 }));

  /* ---- Toast ------------------------------------------------------------- */
  let toastTimer;
  function toast(msg, icon = "check") {
    const root = $("#toast-root");
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `${icons[icon] ? icons[icon]({ s: 18 }) : ""}<span>${esc(msg)}</span>`;
    root.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 450);
    }, 2600);
  }

  /* ---- Reveal on scroll -------------------------------------------------- */
  let observer;
  function observeReveals(root = document) {
    const els = $$(".reveal, [data-stagger]", root);
    // Bez IntersectionObserver pokazujemy treść od razu — widoczność > animacja
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("in")); return; }
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); observer.unobserve(e.target); } }),
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
    }
    els.forEach((el) => observer.observe(el));
    // Siatka bezpieczeństwa: żaden blok nie może zostać trwale niewidoczny
    // (np. gdy karta jest w tle i przejścia się nie odpalą).
    setTimeout(() => els.forEach((el) => el.classList.add("in")), 3000);
  }
  function staggerDelays(root = document) {
    $$("[data-stagger]", root).forEach((group) => {
      Array.from(group.children).forEach((child, i) => {
        child.style.transitionDelay = `${Math.min(i * 55, 440)}ms`;
      });
    });
  }
  // Blur-up: oznacz obrazy już wczytane (np. z cache) jako gotowe
  function hydrateImages(root = document) {
    $$(".card__img", root).forEach((img) => {
      if (img.complete && img.naturalWidth > 0) img.classList.add("loaded");
    });
  }

  /* ---- Nawigacja --------------------------------------------------------- */
  function renderNav() {
    const cats = Store.getCategories();
    const nav = $("#nav-root");
    nav.innerHTML = `
      <nav class="nav" id="mainNav">
        <div class="nav__inner">
          <a href="#/" class="brand" aria-label="OKŁADKA — strona główna">
            <span class="brand__mark"></span> OKŁADKA
          </a>
          <div class="nav__links" id="navLinks">
            <a href="#/sklep" class="nav__link" data-match="/sklep">Sklep</a>
            <a href="#/o-nas" class="nav__link" data-match="/o-nas">O nas</a>
            <a href="#/kontakt" class="nav__link" data-match="/kontakt">Kontakt</a>
          </div>
          <div class="nav__spacer"></div>
          <div class="nav__actions">
            <button class="icon-btn" id="themeToggle" aria-label="Przełącz motyw">${icons.moon({ s: 19 })}</button>
            <a href="#/sklep" class="icon-btn nav__search" aria-label="Szukaj">${icons.search({ s: 19 })}</a>
            <button class="icon-btn cart-btn" id="cartToggle" aria-label="Koszyk">
              ${icons.bag({ s: 20 })}
              <span class="cart-badge" id="cartBadge">0</span>
            </button>
            <button class="icon-btn nav__toggle" id="mobileToggle" aria-label="Menu">${icons.menu()}</button>
          </div>
        </div>
      </nav>`;

    $("#cartToggle").addEventListener("click", openCart);
    $("#themeToggle").addEventListener("click", toggleTheme);
    $("#mobileToggle").addEventListener("click", openMobileMenu);
    syncTheme();
    updateCartBadge();

    const navEl = $("#mainNav");
    const onScroll = () => navEl.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setActiveNav(path) {
    $$(".nav__link").forEach((a) => {
      const m = a.dataset.match;
      a.classList.toggle("active", path === m || (m !== "/" && path.startsWith(m)));
    });
  }

  /* ---- Menu mobilne ------------------------------------------------------ */
  function openMobileMenu() {
    const cats = Store.getCategories();
    const wrap = document.createElement("div");
    wrap.className = "overlay show";
    wrap.style.zIndex = 110;
    wrap.innerHTML = `
      <div style="position:absolute;top:0;right:0;height:100dvh;width:min(320px,85vw);background:var(--paper);padding:24px;display:flex;flex-direction:column;gap:6px;box-shadow:var(--shadow-lg)">
        <button class="icon-btn" style="align-self:flex-end" aria-label="Zamknij">${icons.x()}</button>
        <a href="#/sklep" class="nav__link" style="font-size:1.1rem;padding:12px 0">Sklep</a>
        ${cats.map((c) => `<a href="#/kategoria/${c.slug}" class="nav__link" style="font-size:1.1rem;padding:12px 0">${esc(c.name)}</a>`).join("")}
        <a href="#/o-nas" class="nav__link" style="font-size:1.1rem;padding:12px 0">O nas</a>
        <a href="#/kontakt" class="nav__link" style="font-size:1.1rem;padding:12px 0">Kontakt</a>
      </div>`;
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.addEventListener("click", (e) => { if (e.target === wrap) close(); });
    wrap.querySelector(".icon-btn").addEventListener("click", close);
    $$("a", wrap).forEach((a) => a.addEventListener("click", close));
  }

  /* ---- Motyw ------------------------------------------------------------- */
  function currentEffectiveTheme() {
    const t = Store.getTheme();
    if (t === "auto") return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    return t;
  }
  function toggleTheme() {
    const eff = currentEffectiveTheme();
    const next = eff === "dark" ? "light" : "dark";
    Store.setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    syncTheme();
  }
  function syncTheme() {
    const btn = $("#themeToggle");
    if (!btn) return;
    btn.innerHTML = currentEffectiveTheme() === "dark" ? icons.sun({ s: 19 }) : icons.moon({ s: 19 });
  }

  /* ---- Karta produktu ---------------------------------------------------- */
  function productCard(p) {
    const cat = Store.getCategory(p.category);
    return `
      <article class="card reveal">
        <div class="card__media">
          <span class="card__cat">${esc(cat ? cat.name : p.category)}</span>
          <a href="#/produkt/${p.id}" aria-label="${esc(p.title)}">
            <img class="card__img" src="${esc(p.image)}" alt="Plakat ${esc(p.title)}" loading="lazy"
                 onload="this.classList.add('loaded')"
                 onerror="this.onerror=null;this.src='assets/posters/placeholder.svg';this.classList.add('loaded')" />
          </a>
          <div class="card__quick">
            <a href="#/produkt/${p.id}" class="btn btn--ghost" style="background:var(--surface)">Zobacz</a>
            <button class="btn btn--primary" data-quickadd="${p.id}">Dodaj · ${money(priceFrom(p))}</button>
          </div>
        </div>
        <a href="#/produkt/${p.id}" class="card__body">
          <span class="card__title">${esc(p.title)}</span>
          <span class="card__price">od <b>${money(priceFrom(p))}</b></span>
        </a>
      </article>`;
  }

  function bindQuickAdd(root = document) {
    $$("[data-quickadd]", root).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const p = Store.getProduct(btn.dataset.quickadd);
        if (!p || btn.dataset.busy) return;
        const size = "A4";
        Store.addToCart(p.id, size, 1);
        toast(`Dodano „${p.title}” (${size}) do koszyka`);
        pulseCart();
        // Krótki stan sukcesu — potwierdzenie zmiany stanu
        btn.dataset.busy = "1";
        const original = btn.innerHTML;
        btn.classList.add("btn--added");
        btn.innerHTML = `${icons.check({ s: 16 })} Dodano`;
        setTimeout(() => { btn.classList.remove("btn--added"); btn.innerHTML = original; delete btn.dataset.busy; }, 1200);
      });
    });
  }

  /* ---- Koszyk (drawer) --------------------------------------------------- */
  function renderCartShell() {
    const root = $("#cart-root");
    root.innerHTML = `
      <div class="overlay" id="cartOverlay"></div>
      <aside class="drawer" id="cartDrawer" aria-label="Koszyk" aria-modal="true">
        <div class="drawer__head">
          <h3>Koszyk</h3>
          <button class="icon-btn" id="cartClose" aria-label="Zamknij koszyk">${icons.x()}</button>
        </div>
        <div class="drawer__body" id="cartBody"></div>
        <div class="drawer__foot" id="cartFoot"></div>
      </aside>`;
    $("#cartOverlay").addEventListener("click", closeCart);
    $("#cartClose").addEventListener("click", closeCart);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });
  }

  function renderCartContents() {
    const body = $("#cartBody"), foot = $("#cartFoot");
    if (!body) return;
    const lines = Store.cartLines();
    if (!lines.length) {
      body.innerHTML = `
        <div class="cart-empty">
          ${icons.bag({ s: 44, w: 1.2 })}
          <p style="margin:14px 0 20px">Twój koszyk jest pusty.</p>
          <a href="#/sklep" class="btn btn--primary" id="emptyShop">Przeglądaj plakaty</a>
        </div>`;
      foot.innerHTML = "";
      const s = $("#emptyShop"); if (s) s.addEventListener("click", closeCart);
      return;
    }
    body.innerHTML = lines.map((l) => `
      <div class="cart-line">
        <img class="cart-line__img" src="${esc(l.product.image)}" alt="${esc(l.product.title)}" />
        <div>
          <div class="cart-line__title">${esc(l.product.title)}</div>
          <div class="cart-line__meta">Rozmiar ${l.size} · ${money(l.unit)}</div>
          <div class="cart-line__ctrls">
            <div class="mini-qty">
              <button data-dec="${l.id}|${l.size}" aria-label="Mniej">−</button>
              <span>${l.qty}</span>
              <button data-inc="${l.id}|${l.size}" aria-label="Więcej">+</button>
            </div>
            <button class="cart-line__rm" data-rm="${l.id}|${l.size}">Usuń</button>
          </div>
        </div>
        <div class="cart-line__price">${money(l.lineTotal)}</div>
      </div>`).join("");

    const subtotal = Store.cartSubtotal();
    const freeFrom = 200;
    const shipping = subtotal >= freeFrom ? 0 : 15;
    const pct = Math.min(100, Math.round((subtotal / freeFrom) * 100));
    foot.innerHTML = `
      ${subtotal < freeFrom
        ? `<div style="font-size:.82rem;color:var(--ink-2);margin-bottom:2px">Do <b style="color:var(--ink)">darmowej dostawy</b> brakuje ${money(freeFrom - subtotal)}</div>
           <div class="ship-progress"><div class="ship-progress__bar" id="shipBar"></div></div>`
        : `<div style="display:flex;align-items:center;gap:8px;font-size:.84rem;color:var(--accent);font-weight:600;margin-bottom:10px">${icons.check({ s: 16 })} Masz darmową dostawę</div>`}
      <div class="summary-row"><span>Suma częściowa</span><span>${money(subtotal)}</span></div>
      <div class="summary-row"><span>Dostawa</span><span>${shipping === 0 ? "Gratis" : money(shipping)}</span></div>
      <div class="summary-row summary-row--total"><span>Razem</span><span>${money(subtotal + shipping)}</span></div>
      <a href="#/kasa" class="btn btn--primary btn--block" id="goCheckout">Przejdź do kasy ${icons.arrowRight({ s: 18 })}</a>
      <button class="drawer__continue" id="keepShopping">Kontynuuj zakupy</button>
      <div class="drawer__trust">
        <span>${icons.shield({ s: 15 })} Bezpieczna płatność</span>
        <span>${icons.truck({ s: 15 })} Wysyłka 48h</span>
        <span>${icons.box({ s: 15 })} 14 dni na zwrot</span>
      </div>`;

    const shipBar = $("#shipBar");
    if (shipBar) requestAnimationFrame(() => { shipBar.style.width = pct + "%"; });

    $$("[data-inc]", body).forEach((b) => b.addEventListener("click", () => { const [id, size] = b.dataset.inc.split("|"); const it = Store.getCart().find((i) => i.id === id && i.size === size); Store.setQty(id, size, (it ? it.qty : 0) + 1); }));
    $$("[data-dec]", body).forEach((b) => b.addEventListener("click", () => { const [id, size] = b.dataset.dec.split("|"); const it = Store.getCart().find((i) => i.id === id && i.size === size); Store.setQty(id, size, (it ? it.qty : 1) - 1); }));
    $$("[data-rm]", body).forEach((b) => b.addEventListener("click", () => {
      const [id, size] = b.dataset.rm.split("|");
      const line = b.closest(".cart-line");
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (line && !reduce) { line.classList.add("removing"); setTimeout(() => Store.removeFromCart(id, size), 280); }
      else Store.removeFromCart(id, size);
    }));
    const gc = $("#goCheckout");
    if (gc) gc.addEventListener("click", (e) => {
      if (typeof ShopifyClient !== "undefined" && ShopifyClient.enabled()) { e.preventDefault(); startCheckout(gc); }
      else closeCart(); // demo: link prowadzi do #/kasa
    });
    const ks = $("#keepShopping"); if (ks) ks.addEventListener("click", closeCart);
  }

  /* ---- Kasa: Shopify (headless) albo demo -------------------------------- */
  async function startCheckout(triggerBtn) {
    const lines = Store.cartLines().map((l) => ({ handle: l.id, size: l.size, qty: l.qty }));
    if (!lines.length) { toast("Koszyk jest pusty", "info"); return; }

    // Tryb demo (brak konfiguracji Shopify) — poglądowa kasa na tej stronie
    if (!(typeof ShopifyClient !== "undefined" && ShopifyClient.enabled())) {
      closeCart();
      location.hash = "#/kasa";
      return;
    }

    // Headless: zbuduj koszyk w Shopify i przekieruj do kasy Shopify
    const btn = triggerBtn;
    let original;
    if (btn) { original = btn.innerHTML; btn.setAttribute("disabled", "true"); btn.textContent = "Przekierowuję do kasy…"; }
    try {
      const url = await ShopifyClient.createCheckout(lines);
      window.location.href = url;
    } catch (e) {
      console.warn("Shopify checkout error", e);
      toast("Nie udało się otworzyć kasy: " + e.message, "info");
      if (btn) { btn.removeAttribute("disabled"); btn.innerHTML = original; }
    }
  }

  function openCart() { renderCartContents(); $("#cartOverlay").classList.add("show"); $("#cartDrawer").classList.add("show"); document.body.style.overflow = "hidden"; }
  function closeCart() { const o = $("#cartOverlay"), d = $("#cartDrawer"); if (o) o.classList.remove("show"); if (d) d.classList.remove("show"); document.body.style.overflow = ""; }

  function updateCartBadge() {
    const badge = $("#cartBadge");
    if (!badge) return;
    const n = Store.cartCount();
    badge.textContent = n;
    badge.classList.toggle("show", n > 0);
  }
  function pulseCart() {
    const btn = $("#cartToggle");
    if (!btn) return;
    btn.animate([{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }], { duration: 340, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  /* ---- Stopka ------------------------------------------------------------ */
  function renderFooter() {
    const cats = Store.getCategories();
    $("#footer-root").innerHTML = `
      <footer class="footer">
        <div class="wrap">
          <div class="footer__grid">
            <div class="footer__brand">
              <a href="#/" class="brand"><span class="brand__mark"></span> OKŁADKA</a>
              <p>Kuratorowana galeria plakatów drukowanych na błyszczącym papierze 200 g. Wysyłka w całej Polsce.</p>
              <form class="newsletter" id="nlForm" novalidate>
                <label for="nlInput">Nowe plakaty raz w miesiącu</label>
                <div class="newsletter__row">
                  <input type="email" id="nlInput" placeholder="Twój e-mail" aria-label="E-mail do newslettera" />
                  <button class="btn btn--primary" type="submit">Zapisz</button>
                </div>
              </form>
            </div>
            <nav class="footer__col" aria-label="Sklep">
              <h4>Sklep</h4>
              <a href="#/sklep">Wszystkie plakaty</a>
              ${cats.map((c) => `<a href="#/kategoria/${c.slug}">${esc(c.name)}</a>`).join("")}
            </nav>
            <nav class="footer__col" aria-label="Informacje">
              <h4>Informacje</h4>
              <a href="#/o-nas">O nas</a>
              <a href="#/kontakt">Kontakt i zwroty</a>
              <a href="#/sklep">Rozmiary i druk</a>
              ${typeof ShopifyClient !== "undefined" && ShopifyClient.productionUI() ? "" : `<a href="#/admin">Panel sklepu</a>`}
            </nav>
            <div class="footer__col">
              <h4>Kontakt</h4>
              <a href="mailto:hej@oklada.store">hej@oklada.store</a>
              <a href="tel:+48555123456">+48 555 123 456</a>
              <p class="footer__addr">pon–pt, 9–17<br/>Wysyłka w całej Polsce</p>
              <div class="footer__social">
                <a href="#/kontakt" class="icon-btn" aria-label="Instagram">${icons.instagram({ s: 18 })}</a>
                <a href="mailto:hej@oklada.store" class="icon-btn" aria-label="Napisz e-mail">${icons.mail({ s: 18 })}</a>
              </div>
            </div>
          </div>
          <div class="footer__bottom">
            <span>© ${new Date().getFullYear()} OKŁADKA. Projekt demonstracyjny.</span>
            <div class="pay-badges">
              <span>Przelewy24</span><span>BLIK</span><span>Visa</span><span>Mastercard</span><span>Apple Pay</span>
            </div>
          </div>
        </div>
      </footer>`;
    const nlForm = $("#nlForm");
    if (nlForm) nlForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#nlInput");
      const v = input.value.trim();
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { toast("Zapisano do newslettera. Do usłyszenia!"); input.value = ""; }
      else { toast("Podaj poprawny adres e-mail", "info"); input.focus(); }
    });
  }

  /* ---- Init subskrypcje -------------------------------------------------- */
  Store.on("cart", () => { updateCartBadge(); renderCartContents(); });
  Store.on("catalog", () => { renderNav(); renderFooter(); });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTheme);

  return {
    icons, money, esc, $, $$, priceFrom, toast,
    observeReveals, staggerDelays, hydrateImages,
    renderNav, setActiveNav, renderFooter, renderCartShell,
    productCard, bindQuickAdd, openCart, closeCart, updateCartBadge, startCheckout,
  };
})();
