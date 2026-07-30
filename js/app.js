/* ============================================================================
   app.js  —  Router (hash) + inicjalizacja aplikacji.
   ========================================================================== */

const Router = (() => {
  const app = () => document.getElementById("app");
  const navRoot = () => document.getElementById("nav-root");
  const footRoot = () => document.getElementById("footer-root");

  function parse() {
    let hash = location.hash.replace(/^#/, "");
    if (!hash || hash === "/") return { name: "home", segs: [], path: "/" };
    const segs = hash.split("/").filter(Boolean);
    return { segs, path: "/" + segs.join("/") };
  }

  function resolve() {
    const { segs, path } = parse();
    const s0 = segs[0];

    if (!s0) return { view: Pages.home(), match: "/", chrome: true };
    if (s0 === "sklep") return { view: Pages.shop({}), match: "/sklep", chrome: true };
    if (s0 === "kategoria" && segs[1]) return { view: Pages.shop({ cat: segs[1] }), match: "/kategoria/" + segs[1], chrome: true };
    if (s0 === "produkt" && segs[1]) return { view: Pages.product({ id: segs[1] }), match: "/produkt", chrome: true };
    if (s0 === "o-nas") return { view: Pages.about(), match: "/o-nas", chrome: true };
    if (s0 === "kontakt") return { view: Pages.contact(), match: "/kontakt", chrome: true };
    if (s0 === "kasa") return { view: Pages.checkout(), match: "/kasa", chrome: true };
    if (s0 === "potwierdzenie") return { view: Pages.confirmation(), match: "/potwierdzenie", chrome: true };
    if (s0 === "admin") {
      // W trybie produkcyjnym headless panel demo jest wyłączony (dane są w Shopify)
      if (typeof ShopifyClient !== "undefined" && ShopifyClient.productionUI()) {
        return { view: Pages.home(), match: "/", chrome: true };
      }
      return { view: Admin.render(), match: "/admin", chrome: false };
    }
    return { view: Pages.notFound(), match: path, chrome: true };
  }

  let current = null;

  function render() {
    const { view, match, chrome } = resolve();
    current = { match };

    // Zmiana widoku zawsze zamyka szufladę koszyka (inaczej zostaje otwarta
    // nad nową stroną i blokuje przewijanie strony pod spodem).
    UI.closeCart();

    // Chrome sklepu (nav + stopka) ukrywamy na widoku admina
    navRoot().style.display = chrome ? "" : "none";
    footRoot().style.display = chrome ? "" : "none";

    app().innerHTML = view.html;
    app().classList.remove("page-enter");
    void app().offsetWidth; // reflow, aby restart animacji zadziałał
    app().classList.add("page-enter");

    if (chrome) UI.setActiveNav(match);

    // Animacje wejścia
    UI.staggerDelays(app());
    UI.observeReveals(app());
    UI.hydrateImages(app());

    // Scroll na górę przy zmianie widoku
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    if (typeof view.after === "function") view.after();

    // Meta title
    document.title = titleFor(match);
  }

  function titleFor(match) {
    const base = "OKŁADKA — Galeria plakatów";
    const map = {
      "/": base,
      "/sklep": "Sklep · " + base,
      "/o-nas": "O nas · " + base,
      "/kontakt": "Kontakt · " + base,
      "/kasa": "Kasa · " + base,
      "/admin": "Panel sklepu · OKŁADKA",
    };
    return map[match] || base;
  }

  function reload() { render(); }

  /* ---- Katalog z Shopify (headless) --------------------------------------- */
  // Mapuje surowe produkty ze Storefront API na format sklepu. Interfejs się nie
  // zmienia — te same pola (id, category, image, prices{A4,A3,B2}, ...).
  // Czyści opis: usuwa automatyczny boilerplate z importu CSV („Druk: … / Dostępne
  // rozmiary: …”). Nie rusza normalnych opisów wpisywanych ręcznie w Shopify.
  function cleanDescription(desc) {
    if (!desc) return "";
    let d = String(desc);
    let cut = -1;
    [/Druk:\s*błyszcz/i, /Dostępne rozmiary:/i].forEach((re) => {
      const m = d.search(re);
      if (m > 0 && (cut === -1 || m < cut)) cut = m;
    });
    if (cut > 0) d = d.slice(0, cut);
    return d.trim();
  }

  function mapShopifyProducts(nodes) {
    const cats = Store.getCategories();
    const byName = {};
    cats.forEach((c) => { byName[c.name.trim().toLowerCase()] = c.slug; });
    const fallbackCat = cats[0] ? cats[0].slug : "inne";

    return nodes.map((n) => {
      const prices = {};
      (n.variants && n.variants.nodes ? n.variants.nodes : []).forEach((v) => {
        const opt = (v.selectedOptions || []).find((o) => /rozmiar|size/i.test(o.name)) || (v.selectedOptions || [])[0];
        if (opt && opt.value) prices[opt.value] = Math.round(parseFloat((v.price && v.price.amount) || "0"));
      });
      let category = byName[(n.productType || "").trim().toLowerCase()];
      if (!category) {
        for (const t of (n.tags || [])) { const s = byName[t.trim().toLowerCase()]; if (s) { category = s; break; } }
      }
      if (!category) category = fallbackCat;
      const featured = (n.tags || []).some((t) => /wyróżnion|wyroznion|bestseller|featured|polecan/i.test(t));
      return {
        id: n.handle,
        title: n.title,
        category,
        tags: n.tags || [],
        image: (n.featuredImage && n.featuredImage.url) || `assets/posters/${n.handle}.jpg`,
        featured,
        description: cleanDescription(n.description),
        prices,
      };
    }).filter((p) => Object.keys(p.prices).length); // pomiń produkty bez wariantów cen
  }

  async function loadShopifyCatalog() {
    if (!(typeof ShopifyClient !== "undefined" && ShopifyClient.enabled())) return;
    try {
      const nodes = await Promise.race([
        ShopifyClient.fetchProducts(),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000)),
      ]);
      const mapped = mapShopifyProducts(nodes);
      if (mapped.length) Store.setCatalog(mapped);
    } catch (e) {
      console.warn("Shopify: nie udało się pobrać produktów — używam lokalnego katalogu.", e);
    }
  }

  function showLoading() {
    app().innerHTML = `<section class="section wrap" style="min-height:60vh;display:grid;place-content:center;text-align:center"><div class="spinner" style="margin:0 auto"></div></section>`;
  }

  async function start() {
    Store.seedIfNeeded();
    UI.renderNav();
    UI.renderFooter();
    UI.renderCartShell();
    window.addEventListener("hashchange", render);
    if (typeof ShopifyClient !== "undefined" && ShopifyClient.enabled()) {
      showLoading();
      await loadShopifyCatalog();
    }
    render();
  }

  return { start, reload, get current() { return current; } };
})();

document.addEventListener("DOMContentLoaded", Router.start);
