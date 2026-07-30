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

  function start() {
    Store.seedIfNeeded();
    UI.renderNav();
    UI.renderFooter();
    UI.renderCartShell();
    window.addEventListener("hashchange", render);
    render();
  }

  return { start, reload, get current() { return current; } };
})();

document.addEventListener("DOMContentLoaded", Router.start);
