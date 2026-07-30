/* ============================================================================
   shopify.js  —  Integracja headless: front OKŁADKA + koszyk/kasa Shopify.

   Jak to działa:
   - Przeglądanie, karty produktów i koszyk = ten front (lokalne dane + zdjęcia).
   - „Przejdź do kasy" buduje koszyk w Shopify (Storefront API) po uchwycie produktu
     i rozmiarze (A4/A3/B2), a potem przekierowuje do bezpiecznej KASY SHOPIFY.
   - Zamówienie i płatność obsługuje Shopify (pojawia się w panelu Shopify).

   KONFIGURACJA (uzupełnij dwa pola — instrukcja w shopify/HEADLESS.md):
   - domain: adres sklepu .myshopify.com (NIE domena własna), np. "oklada-xyz.myshopify.com"
   - token:  Storefront API access token (publiczny, bezpieczny po stronie przeglądarki)

   Dopóki pola są puste, sklep działa w trybie demo (kasa poglądowa na tej stronie).
   ========================================================================== */

const ShopifyClient = (() => {
  const CONFIG = {
    domain: "1mz4kx-h8.myshopify.com",   // adres .myshopify.com (bez https:// i /)
    token: "125d49d629014052a308d24aca71ee91",   // Storefront API access token (publiczny)
    apiVersion: "2025-01",

    // Tryb produkcyjny headless: ukrywa demową kasę (#/kasa) i panel admina (#/admin),
    // żeby po wdrożeniu nic nie myliło klientów. Realne zamówienia/wiadomości są w Shopify.
    // Ustaw false, jeśli chcesz wrócić do pełnego dema na localhoście.
    hideDemo: true,
  };

  const enabled = () => Boolean(CONFIG.domain && CONFIG.token);
  // „Produkcyjny UI" = kasę robi Shopify albo świadomie ukrywamy demo
  const productionUI = () => enabled() || CONFIG.hideDemo;
  const endpoint = () => `https://${CONFIG.domain}/api/${CONFIG.apiVersion}/graphql.json`;

  async function gql(query, variables) {
    const res = await fetch(endpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": CONFIG.token,
      },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Shopify HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
    return json.data;
  }

  // Uchwyt produktu (handle) w Shopify = id produktu u nas (tak generuje CSV).
  // Rozmiar A4/A3/B2 = wartość opcji wariantu „Rozmiar".
  const variantCache = {};
  async function getVariantId(handle, size) {
    const key = `${handle}|${size}`;
    if (variantCache[key]) return variantCache[key];
    const data = await gql(
      `query($h:String!){product(handle:$h){title variants(first:25){nodes{id selectedOptions{name value}}}}}`,
      { h: handle }
    );
    const p = data.product;
    if (!p) throw new Error(`Brak produktu „${handle}" w Shopify (zaimportuj CSV).`);
    const v = p.variants.nodes.find((n) => n.selectedOptions.some((o) => o.value === size));
    if (!v) throw new Error(`Brak rozmiaru „${size}" dla „${handle}".`);
    variantCache[key] = v.id;
    return v.id;
  }

  // Pobiera wszystkie produkty ze Storefront API (surowe węzły). Mapowanie na
  // format sklepu robi app.js (potrzebuje listy kategorii). Zwraca [] przy błędzie.
  async function fetchProducts() {
    const q = `query {
      products(first: 100) {
        nodes {
          handle title description productType tags
          featuredImage { url altText }
          variants(first: 12) {
            nodes { id availableForSale price { amount } selectedOptions { name value } }
          }
        }
      }
    }`;
    const data = await gql(q, {});
    return (data.products && data.products.nodes) || [];
  }

  // lines: [{ handle, size, qty }]  →  zwraca URL kasy Shopify
  async function createCheckout(lines) {
    const cartLines = [];
    for (const l of lines) {
      cartLines.push({ merchandiseId: await getVariantId(l.handle, l.size), quantity: l.qty });
    }
    const data = await gql(
      `mutation($lines:[CartLineInput!]!){cartCreate(input:{lines:$lines}){cart{checkoutUrl} userErrors{message}}}`,
      { lines: cartLines }
    );
    const r = data.cartCreate;
    if (r.userErrors && r.userErrors.length) throw new Error(r.userErrors.map((e) => e.message).join("; "));
    if (!r.cart || !r.cart.checkoutUrl) throw new Error("Shopify nie zwrócił adresu kasy.");
    return r.cart.checkoutUrl;
  }

  return { CONFIG, enabled, productionUI, getVariantId, createCheckout, fetchProducts };
})();
