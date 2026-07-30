/* ============================================================================
   pages.js  —  Widoki sklepu (storefront).
   Każdy widok zwraca { html, after? }. Router wstawia html do #app i wywołuje after().
   ========================================================================== */

const Pages = (() => {
  const { icons, money, esc, $, $$, priceFrom, toast, productCard, bindQuickAdd } = UI;

  /* Konfiguracja formularza kontaktowego:
     - zostaw pusty ("") aby działał tryb demo (zapis lokalny + otwarcie klienta poczty)
     - wklej URL z Formspree/Getform, aby wysyłać realne maile bez backendu   */
  // Odbiór wiadomości z formularza: Web3Forms (klucz publiczny — bezpieczny w kodzie).
  // Wiadomości przychodzą na e-mail przypisany do tego klucza w web3forms.com.
  const WEB3FORMS_KEY = "28a5ce7b-9529-414a-91e5-a4995cc4a861";
  const CONTACT_ENDPOINT = "https://api.web3forms.com/submit";
  const SHOP_EMAIL = "hej@oklada.store";
  const freeShipFrom = 200;
  const shipCost = (subtotal) => (subtotal >= freeShipFrom ? 0 : 15);

  let lastOrder = null;

  /* ======================= HOME ========================================== */
  function home() {
    const products = Store.getProducts();
    const cats = Store.getCategories();
    const flagged = products.filter((p) => p.featured);
    const featured = (flagged.length ? flagged : products).slice(0, 8);
    const catImg = (slug) => (products.find((p) => p.category === slug) || {}).image || "";

    const html = `
      <section class="hero wrap">
        <div class="hero__grid">
          <div>
            <span class="pill reveal">Galeria plakatów · A4 · A3 · B2</span>
            <h1 class="hero__title display reveal">Plakaty, które<br/><em>robią</em> wnętrze.</h1>
            <p class="hero__sub reveal">Kuratorowany wybór grafik: motoryzacja, typografia, ilustracja i abstrakcja. Druk na błyszczącym papierze 200 g, pakowany w sztywną tubę.</p>
            <div class="hero__cta reveal">
              <a href="#/sklep" class="btn btn--primary btn--lg">Przeglądaj kolekcję <span class="btn__icon">${icons.arrowUpRight({ s: 15 })}</span></a>
              <a href="#/o-nas" class="btn btn--ghost btn--lg">Jak drukujemy</a>
            </div>
            <div class="hero__meta reveal">
              <div><b>${products.length}</b><span>plakatów w ofercie</span></div>
              <div><b>3</b><span>rozmiary A4–B2</span></div>
              <div><b>48h</b><span>wysyłka</span></div>
            </div>
          </div>
          <div class="hero__media reveal">
            <div class="frame"><img src="assets/lifestyle/life-05.jpg" alt="Plakaty w dębowych ramach w ciepłym wnętrzu" /></div>
            <div class="frame frame--poster"><img src="${esc((products.find((p) => p.category === "motoryzacja") || {}).image || "")}" alt="Plakat motoryzacyjny z bliska" /></div>
          </div>
        </div>
      </section>

      <div class="strip">
        <div class="wrap"><div class="strip__inner">
          <div class="marquee">
            <span>Błyszczący papier 200 g</span><span>Pakowane w tubę</span><span>Wysyłka 48h</span><span>Darmowa dostawa od 200 zł</span><span>Kolory odporne na blaknięcie</span>
            <span>Błyszczący papier 200 g</span><span>Pakowane w tubę</span><span>Wysyłka 48h</span><span>Darmowa dostawa od 200 zł</span><span>Kolory odporne na blaknięcie</span>
          </div>
        </div></div>
      </div>

      <section class="section wrap">
        <div class="section__head">
          <div>
            <h2 class="section__title reveal">Przeglądaj według kategorii</h2>
            <p class="section__lead reveal">Cztery światy, jeden papier. Wybierz klimat, który pasuje do Twojej ściany.</p>
          </div>
          <a href="#/sklep" class="link-underline reveal">Wszystkie plakaty ${icons.arrowUpRight({ s: 16 })}</a>
        </div>
        <div class="cats reveal" data-stagger>
          ${cats.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return `
              <a href="#/kategoria/${c.slug}" class="cat-card">
                <div class="cat-card__media"><img src="${esc(catImg(c.slug))}" alt="Kategoria ${esc(c.name)}" loading="lazy" onload="this.style.opacity=1" style="opacity:0;transition:opacity .5s var(--ease-out)" /></div>
                <div class="cat-card__foot">
                  <div>
                    <div class="cat-card__name">${esc(c.name)}</div>
                    <div class="cat-card__count">${count} ${plural(count, "plakat", "plakaty", "plakatów")}</div>
                  </div>
                  <span class="cat-card__arrow">${icons.arrowUpRight({ s: 20 })}</span>
                </div>
              </a>`;
          }).join("")}
        </div>
      </section>

      <section class="section section--tight wrap">
        <div class="section__head">
          <div>
            <h2 class="section__title reveal">Bestsellery tego sezonu</h2>
            <p class="section__lead reveal">Najczęściej wybierane plakaty z całej kolekcji.</p>
          </div>
          <a href="#/sklep" class="link-underline reveal">Zobacz wszystko ${icons.arrowUpRight({ s: 16 })}</a>
        </div>
        <div class="grid" data-stagger>
          ${featured.map(productCard).join("")}
        </div>
      </section>

      <section class="lifestyle">
        <div class="section wrap">
          <div class="section__head">
            <div>
              <h2 class="section__title reveal">Zobacz je na ścianie</h2>
              <p class="section__lead reveal">Nasze plakaty w prawdziwych wnętrzach — dębowa rama, ciepłe światło, nic więcej.</p>
            </div>
            <a href="#/o-nas" class="link-underline reveal">Poznaj nas ${icons.arrowUpRight({ s: 16 })}</a>
          </div>
          <div class="lifestyle-grid reveal">
            <div class="frame"><img src="assets/lifestyle/life-01.jpg" alt="Plakat Porsche 911 GT3 RS w dębowej ramie" loading="lazy" /></div>
            <div class="frame"><img src="assets/lifestyle/life-05.jpg" alt="Plakat Aperol For-Ever w dębowej ramie" loading="lazy" /></div>
            <div class="frame"><img src="assets/lifestyle/life-08.jpg" alt="Plakat z kolekcji w dębowej ramie" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section class="section wrap">
        <div class="values reveal">
          <div class="value">
            <div class="value__ico">${icons.palette({ s: 30, w: 1.4 })}</div>
            <h3>Błyszczący papier 200 g</h3>
            <p>Druk na błyszczącym papierze 200 g. Głębokie czernie, nasycone kolory i wyraźny połysk.</p>
          </div>
          <div class="value">
            <div class="value__ico">${icons.box({ s: 30, w: 1.4 })}</div>
            <h3>Bezpieczne pakowanie</h3>
            <p>Każdy plakat jedzie w sztywnej tubie z zabezpieczonymi końcami. Dociera prosto, gotowy do oprawy.</p>
          </div>
          <div class="value">
            <div class="value__ico">${icons.truck({ s: 30, w: 1.4 })}</div>
            <h3>Wysyłka 48h</h3>
            <p>Drukujemy na bieżąco i nadajemy w ciągu dwóch dni roboczych. Darmowa dostawa od 200 zł.</p>
          </div>
        </div>
      </section>

      <section class="section wrap">
        <div style="background:var(--ink);color:var(--paper);border-radius:var(--r-card);padding:clamp(36px,6vw,72px);display:grid;grid-template-columns:1.4fr 1fr;gap:32px;align-items:center" class="reveal cta-band">
          <div>
            <h2 class="display" style="font-size:clamp(2rem,4vw,3.2rem);color:var(--paper)">Nie wiesz,<br/>od czego zacząć?</h2>
            <p style="color:rgba(247,246,242,.7);margin-top:14px;max-width:44ch">Napisz do nas kilka słów o wnętrzu i stylu. Dobierzemy zestaw plakatów, który zagra z Twoją przestrzenią.</p>
          </div>
          <div style="display:flex;flex-direction:column;gap:12px">
            <a href="#/kontakt" class="btn" style="background:var(--paper);color:var(--ink)">Napisz do nas ${icons.arrowRight({ s: 18 })}</a>
            <a href="#/sklep" class="btn btn--ghost" style="color:var(--paper);border-color:rgba(247,246,242,.3)">Przeglądaj samodzielnie</a>
          </div>
        </div>
      </section>`;

    return { html, after: () => bindQuickAdd($("#app")) };
  }

  /* ======================= SKLEP / KATEGORIA ============================== */
  function shop(params) {
    const activeCat = params && params.cat ? params.cat : "all";
    const cats = Store.getCategories();
    const catObj = Store.getCategory(activeCat);

    const html = `
      <section class="section section--tight wrap page-enter">
        <div style="max-width:60ch">
          <p class="eyebrow">${activeCat === "all" ? "Cała kolekcja" : "Kategoria"}</p>
          <h1 class="section__title" style="font-size:clamp(2.2rem,5vw,3.4rem);margin:8px 0 12px">${esc(catObj ? catObj.name : "Wszystkie plakaty")}</h1>
          <p class="muted">${esc(catObj ? catObj.desc : "Cały katalog w jednym miejscu. Filtruj po kategorii albo szukaj po nazwie.")}</p>
        </div>

        <div style="display:flex;gap:16px;justify-content:space-between;align-items:center;flex-wrap:wrap;margin:28px 0 24px">
          <div class="filters" id="catFilters">
            <a href="#/sklep" class="chip ${activeCat === "all" ? "active" : ""}">Wszystkie</a>
            ${cats.map((c) => `<a href="#/kategoria/${c.slug}" class="chip ${activeCat === c.slug ? "active" : ""}">${esc(c.name)}</a>`).join("")}
          </div>
          <div style="position:relative;min-width:220px">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--ink-3)">${icons.search({ s: 18 })}</span>
            <input class="input" id="shopSearch" placeholder="Szukaj plakatu…" style="padding-left:38px" aria-label="Szukaj" />
          </div>
        </div>

        <p class="muted" id="resultCount" style="font-size:.88rem;margin-bottom:20px"></p>
        <div class="grid" id="productGrid" data-stagger></div>
        <div id="emptyResults"></div>
      </section>`;

    const after = () => {
      const grid = $("#productGrid");
      const search = $("#shopSearch");
      const countEl = $("#resultCount");
      const emptyEl = $("#emptyResults");

      const draw = () => {
        const q = (search.value || "").trim().toLowerCase();
        let list = Store.getProducts();
        if (activeCat !== "all") list = list.filter((p) => p.category === activeCat);
        if (q) list = list.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          (p.description || "").toLowerCase().includes(q));

        countEl.textContent = `${list.length} ${plural(list.length, "plakat", "plakaty", "plakatów")}`;
        if (!list.length) {
          grid.innerHTML = "";
          emptyEl.innerHTML = `
            <div style="text-align:center;padding:70px 20px;color:var(--ink-3)">
              ${icons.search({ s: 42, w: 1.2 })}
              <p style="margin:14px 0 20px">Brak plakatów dla „${esc(q)}”.</p>
              <button class="btn btn--ghost" id="clearSearch">Wyczyść wyszukiwanie</button>
            </div>`;
          const cs = $("#clearSearch"); if (cs) cs.addEventListener("click", () => { search.value = ""; draw(); });
          return;
        }
        emptyEl.innerHTML = "";
        grid.innerHTML = list.map(productCard).join("");
        UI.staggerDelays(grid);
        requestAnimationFrame(() => grid.classList.add("in"));
        UI.observeReveals(grid);
        UI.hydrateImages(grid);
        bindQuickAdd(grid);
      };

      let t;
      search.addEventListener("input", () => { clearTimeout(t); t = setTimeout(draw, 160); });
      draw();
    };

    return { html, after };
  }

  /* ======================= PRODUKT (PDP) ================================== */
  function product(params) {
    const p = Store.getProduct(params.id);
    if (!p) return notFound();
    const cat = Store.getCategory(p.category);
    const related = Store.getProducts().filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

    const html = `
      <section class="section section--tight wrap page-enter">
        <nav style="font-size:.86rem;color:var(--ink-3);margin-bottom:22px">
          <a href="#/sklep" class="link-underline" style="color:var(--ink-3)">Sklep</a>
          <span> / </span>
          <a href="#/kategoria/${p.category}" class="link-underline" style="color:var(--ink-3)">${esc(cat ? cat.name : "")}</a>
          <span> / </span><span>${esc(p.title)}</span>
        </nav>

        <div class="pdp">
          <div class="pdp__media">
            <div class="pdp__frame"><img src="${esc(p.image)}" alt="Plakat ${esc(p.title)}" /></div>
          </div>
          <div>
            <span class="pdp__cat">${esc(cat ? cat.name : "")}</span>
            <h1 class="pdp__title display">${esc(p.title)}</h1>
            <div class="pdp__price"><span id="pdpPrice">${money(p.prices.A4)}</span> <small id="pdpSizeLabel">/ A4</small></div>
            <p class="pdp__desc">${esc(p.description)}</p>

            <div class="field-label"><span>Rozmiar</span><span id="sizeDim" style="text-transform:none;letter-spacing:0;font-weight:500">21 × 29,7 cm</span></div>
            <div class="sizes" id="sizePicker">
              ${SIZES.map((s, i) => `
                <button class="size ${i === 0 ? "active" : ""}" data-size="${s.code}" data-dim="${s.dim}">
                  <b>${s.label}</b>
                  <span>${s.dim}</span>
                  <em>${money(p.prices[s.code])}</em>
                </button>`).join("")}
            </div>

            <div class="field-label"><span>Ilość</span></div>
            <div class="pdp__buy">
              <div class="qty">
                <button id="qtyDec" aria-label="Mniej">−</button>
                <span id="qtyVal">1</span>
                <button id="qtyInc" aria-label="Więcej">+</button>
              </div>
              <button class="btn btn--primary" id="addBtn">Dodaj do koszyka</button>
            </div>
            <button class="btn btn--accent btn--block" id="buyNow" style="margin-bottom:26px">Kup teraz ${icons.arrowRight({ s: 18 })}</button>

            <div class="pdp__accordion">
              ${accordion("Druk i papier", "Druk na błyszczącym papierze 200 g/m². Nasycone kolory, głęboka czerń i wyraźny połysk. Kolory odporne na blaknięcie. Bez ramy — plakat wysyłamy w rolce.")}
              ${accordion("Wymiary", "A4 — 21 × 29,7 cm. A3 — 29,7 × 42 cm. B2 — 50 × 70,7 cm. Wszystkie w proporcji serii A, więc pasują do standardowych ram.")}
              ${accordion("Dostawa i zwroty", "Wysyłka w 48h w sztywnej tubie. Kurier 15 zł, darmowo od 200 zł. 14 dni na zwrot bez podania przyczyny.")}
            </div>
          </div>
        </div>
      </section>

      ${related.length ? `
      <section class="section section--tight wrap">
        <div class="section__head"><h2 class="section__title">Z tej samej półki</h2>
          <a href="#/kategoria/${p.category}" class="link-underline">Więcej z „${esc(cat ? cat.name : "")}” ${icons.arrowUpRight({ s: 16 })}</a>
        </div>
        <div class="grid" data-stagger>${related.map(productCard).join("")}</div>
      </section>` : ""}`;

    const after = () => {
      let size = "A4", qty = 1;
      const priceEl = $("#pdpPrice"), sizeLabel = $("#pdpSizeLabel"), sizeDim = $("#sizeDim"), qtyVal = $("#qtyVal");

      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      $$("#sizePicker .size").forEach((btn) => btn.addEventListener("click", () => {
        if (btn.classList.contains("active")) return;
        $$("#sizePicker .size").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        size = btn.dataset.size;
        sizeLabel.textContent = "/ " + size;
        sizeDim.textContent = btn.dataset.dim;
        // Zmiana ceny z krótkim rozmyciem maskującym zamianę (technika Emila)
        if (reduce) { priceEl.textContent = money(p.prices[size]); }
        else {
          priceEl.classList.add("swap");
          setTimeout(() => { priceEl.textContent = money(p.prices[size]); priceEl.classList.remove("swap"); }, 130);
        }
      }));
      $("#qtyInc").addEventListener("click", () => { qty++; qtyVal.textContent = qty; });
      $("#qtyDec").addEventListener("click", () => { if (qty > 1) { qty--; qtyVal.textContent = qty; } });

      $("#addBtn").addEventListener("click", () => {
        Store.addToCart(p.id, size, qty);
        toast(`Dodano „${p.title}” (${size}) ×${qty}`);
        UI.updateCartBadge();
        UI.openCart();
      });
      $("#buyNow").addEventListener("click", () => {
        Store.addToCart(p.id, size, qty);
        if (typeof ShopifyClient !== "undefined" && ShopifyClient.enabled()) UI.startCheckout($("#buyNow"));
        else location.hash = "#/kasa";
      });

      $$(".acc__head").forEach((h) => h.addEventListener("click", () => {
        const acc = h.closest(".acc");
        const body = acc.querySelector(".acc__body");
        const open = acc.classList.toggle("open");
        body.style.maxHeight = open ? body.scrollHeight + "px" : "0";
      }));

      bindQuickAdd($("#app"));
    };

    return { html, after };
  }

  function accordion(title, body) {
    return `
      <div class="acc">
        <button class="acc__head">${esc(title)} <span class="acc__ico">${icons.plus({ s: 20 })}</span></button>
        <div class="acc__body"><div class="acc__body-inner">${esc(body)}</div></div>
      </div>`;
  }

  /* ======================= O NAS ========================================= */
  function about() {
    const posters = Store.getProducts();
    const html = `
      <section class="section wrap page-enter">
        <div class="about-hero">
          <div>
            <p class="eyebrow reveal">O nas</p>
            <h1 class="display reveal" style="font-size:clamp(2.4rem,5vw,3.8rem);margin:10px 0 20px">Zaczęło się od jednej<br/>pustej ściany.</h1>
            <p class="muted reveal" style="max-width:52ch">OKŁADKA powstała w Szczecinie z prostej frustracji: świetnych plakatów było mało, a te dostępne były drukowane byle jak. Postanowiliśmy robić grafiki, które sami chcielibyśmy powiesić — i drukować je tak, żeby broniły się z bliska.</p>
            <p class="muted reveal" style="max-width:52ch;margin-top:14px">Dziś kuratorujemy kolekcję w czterech światach: motoryzacja, typografia, ilustracja i abstrakcja. Każdy plakat drukujemy na zamówienie, więc nic się nie marnuje.</p>
            <div class="stat-row reveal">
              <div class="stat"><b>2021</b><span>rok założenia</span></div>
              <div class="stat"><b>${posters.length}+</b><span>projektów</span></div>
              <div class="stat"><b>4.9</b><span>ocena klientów</span></div>
            </div>
          </div>
          <div class="about-hero__img reveal"><img src="assets/lifestyle/life-06.jpg" alt="Plakaty z kolekcji w dębowych ramach, w ciepłym wnętrzu" /></div>
        </div>
      </section>

      <section class="section wrap">
        <div class="section__head"><h2 class="section__title reveal">Jak to działa</h2></div>
        <div class="steps" data-stagger>
          <div class="step"><div class="step__n">01</div><h3>Wybierasz plakat</h3><p>Przeglądasz kolekcję i wybierasz rozmiar A4, A3 lub B2 — proporcje serii A pasują do popularnych ram.</p></div>
          <div class="step"><div class="step__n">02</div><h3>Drukujemy na zamówienie</h3><p>Twój plakat trafia do druku na błyszczącym papierze 200 g. Zero magazynu, zero marnowania.</p></div>
          <div class="step"><div class="step__n">03</div><h3>Pakujemy i wysyłamy</h3><p>W sztywnej tubie, w 48h. Dociera prosto i gotowe do oprawy.</p></div>
        </div>
      </section>

      <section class="section wrap">
        <div class="values reveal">
          <div class="value"><div class="value__ico">${icons.leaf({ s: 30, w: 1.4 })}</div><h3>Druk na zamówienie</h3><p>Produkujemy dopiero po zamówieniu — mniej odpadu, mniej nadprodukcji.</p></div>
          <div class="value"><div class="value__ico">${icons.shield({ s: 30, w: 1.4 })}</div><h3>Jakość z bliska</h3><p>Pigmentowe atramenty i gęsty papier. Detale, które widać dopiero na ścianie.</p></div>
          <div class="value"><div class="value__ico">${icons.frame({ s: 30, w: 1.4 })}</div><h3>Gotowe do ramy</h3><p>Standardowe formaty A i B. Wkładasz w ramę ze sklepu i gotowe.</p></div>
        </div>
      </section>

      <section class="section wrap">
        <div class="cta-band reveal" style="background:var(--ink);color:var(--paper);border-radius:var(--r-card);padding:clamp(36px,6vw,64px);text-align:center">
          <h2 class="display" style="font-size:clamp(1.8rem,4vw,2.8rem);color:var(--paper)">Zobacz, co mamy na ścianach</h2>
          <a href="#/sklep" class="btn" style="background:var(--paper);color:var(--ink);margin-top:22px">Przejdź do sklepu ${icons.arrowRight({ s: 18 })}</a>
        </div>
      </section>`;
    return { html, after: () => {} };
  }

  /* ======================= KONTAKT ======================================= */
  function contact() {
    const html = `
      <section class="section wrap page-enter">
        <div class="contact">
          <div class="contact__info">
            <p class="eyebrow">Kontakt</p>
            <h1 class="display" style="font-size:clamp(2.2rem,4.5vw,3.2rem);margin:10px 0 16px">Odezwij się.</h1>
            <p class="muted" style="max-width:40ch">Masz pytanie o plakat, rozmiar albo współpracę? Napisz — zwykle odpisujemy tego samego dnia.</p>
            <div class="contact__list">
              <div class="contact__item">${icons.mail({ s: 22 })}<div><b>E-mail</b><span>${SHOP_EMAIL}</span></div></div>
              <div class="contact__item">${icons.phone({ s: 22 })}<div><b>Telefon</b><span>+48 555 123 456 (pon–pt, 9–17)</span></div></div>
              <div class="contact__item">${icons.truck({ s: 22 })}<div><b>Wysyłka</b><span>Sklep internetowy — wysyłamy w całej Polsce, kurier w 48h.</span></div></div>
              <div class="contact__item">${icons.instagram({ s: 22 })}<div><b>Instagram</b><span>@oklada.store</span></div></div>
            </div>
          </div>

          <div class="contact__card">
            <form id="contactForm" novalidate>
              <div class="form-grid form-grid--2">
                <div class="field">
                  <label for="cName">Imię i nazwisko</label>
                  <input class="input" id="cName" name="name" placeholder="Jan Kowalski" required />
                  <div class="field__err" data-err="cName"></div>
                </div>
                <div class="field">
                  <label for="cEmail">E-mail</label>
                  <input class="input" id="cEmail" name="email" type="email" placeholder="jan@example.com" required />
                  <div class="field__err" data-err="cEmail"></div>
                </div>
              </div>
              <div class="field" style="margin-top:18px">
                <label for="cSubject">Temat</label>
                <select class="select" id="cSubject" name="subject">
                  <option>Pytanie o produkt</option>
                  <option>Status zamówienia</option>
                  <option>Współpraca / hurt</option>
                  <option>Coś innego</option>
                </select>
              </div>
              <div class="field" style="margin-top:18px">
                <label for="cMsg">Wiadomość</label>
                <textarea class="textarea" id="cMsg" name="message" placeholder="W czym możemy pomóc?" required></textarea>
                <div class="field__err" data-err="cMsg"></div>
              </div>
              <div style="display:flex;align-items:center;gap:14px;margin-top:20px;flex-wrap:wrap">
                <button type="submit" class="btn btn--primary btn--lg" id="cSubmit">Wyślij wiadomość ${icons.arrowRight({ s: 18 })}</button>
                <span class="muted" style="font-size:.84rem">Odpowiadamy zwykle w ciągu 24h.</span>
              </div>
            </form>
            <div id="contactDone" style="display:none;text-align:center;padding:20px 0">
              <div style="width:64px;height:64px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;margin:0 auto 18px">${icons.check({ s: 32, w: 2 })}</div>
              <h3 style="font-size:1.4rem">Dziękujemy!</h3>
              <p class="muted" style="margin:8px 0 20px">Twoja wiadomość została zapisana. Odezwiemy się na podany e-mail.</p>
              <button class="btn btn--ghost" id="contactAgain">Wyślij kolejną</button>
            </div>
          </div>
        </div>
      </section>`;

    const after = () => {
      const form = $("#contactForm");
      const done = $("#contactDone");

      const setErr = (id, msg) => {
        const field = $("#" + id).closest(".field");
        field.classList.toggle("invalid", !!msg);
        $(`[data-err="${id}"]`).textContent = msg || "";
      };

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = $("#cName").value.trim();
        const email = $("#cEmail").value.trim();
        const msg = $("#cMsg").value.trim();
        let ok = true;
        if (name.length < 2) { setErr("cName", "Podaj imię i nazwisko."); ok = false; } else setErr("cName", "");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr("cEmail", "Podaj poprawny e-mail."); ok = false; } else setErr("cEmail", "");
        if (msg.length < 5) { setErr("cMsg", "Napisz kilka słów więcej."); ok = false; } else setErr("cMsg", "");
        if (!ok) return;

        const topic = $("#cSubject").value;
        const btn = $("#cSubmit");
        const originalBtn = btn.innerHTML;
        btn.disabled = true; btn.textContent = "Wysyłanie…";

        Store.addMessage({ name, email, subject: topic, message: msg }); // kopia lokalna

        let sent = false;
        try {
          if (WEB3FORMS_KEY) {
            const res = await fetch(CONTACT_ENDPOINT, {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                access_key: WEB3FORMS_KEY,
                subject: `Nowa wiadomość ze sklepu OKŁADKA — ${topic}`,
                from_name: "Formularz OKŁADKA",
                name, email, temat: topic, message: msg,
                botcheck: "", // honeypot antyspamowy
              }),
            });
            const data = await res.json().catch(() => ({}));
            sent = res.ok && data.success === true;
          } else {
            // Zapas: otwórz klienta poczty z gotową treścią
            const body = encodeURIComponent(`Imię: ${name}\nE-mail: ${email}\nTemat: ${topic}\n\n${msg}`);
            window.location.href = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent("[Kontakt] " + topic)}&body=${body}`;
            sent = true;
          }
        } catch (err) {
          console.warn("Contact send error", err);
        }

        if (sent) {
          form.style.display = "none";
          done.style.display = "block";
          toast("Wiadomość wysłana. Dziękujemy!");
        } else {
          btn.disabled = false; btn.innerHTML = originalBtn;
          toast("Nie udało się wysłać. Spróbuj ponownie.", "info");
        }
      });

      $("#contactAgain").addEventListener("click", () => { form.reset(); form.style.display = "block"; done.style.display = "none"; });
    };

    return { html, after };
  }

  /* ======================= KASA (checkout) =============================== */
  function checkout() {
    const lines = Store.cartLines();
    if (!lines.length) {
      return { html: emptyState("Koszyk jest pusty", "Dodaj plakat, zanim przejdziesz do kasy.", "#/sklep", "Przeglądaj plakaty"), after: () => {} };
    }

    // Tryb headless: kasę obsługuje Shopify — przekierowujemy, nie pokazujemy formularza demo
    if (typeof ShopifyClient !== "undefined" && ShopifyClient.enabled()) {
      return {
        html: `<section class="section wrap page-enter" style="text-align:center;min-height:52vh;display:grid;place-content:center">
                 <div><div class="spinner" style="margin:0 auto 20px"></div>
                 <h1 class="display" style="font-size:clamp(1.6rem,3vw,2.2rem)">Przekierowuję do kasy…</h1>
                 <p class="muted" style="margin-top:10px">Bezpieczna płatność po stronie Shopify.</p></div></section>`,
        after: () => UI.startCheckout(),
      };
    }

    // Tryb produkcyjny, ale Shopify jeszcze nieskonfigurowany (stan przejściowy przy wdrażaniu)
    if (typeof ShopifyClient !== "undefined" && ShopifyClient.productionUI()) {
      return {
        html: `<section class="section wrap page-enter" style="text-align:center;min-height:52vh;display:grid;place-content:center">
                 <div style="max-width:46ch;margin:0 auto">
                   <div style="color:var(--accent);display:flex;justify-content:center;margin-bottom:14px">${icons.info({ s: 40, w: 1.4 })}</div>
                   <h1 class="display" style="font-size:clamp(1.6rem,3vw,2.2rem);margin-bottom:10px">Kasę obsługuje Shopify</h1>
                   <p class="muted">Aby uruchomić płatności, uzupełnij <b style="color:var(--ink)">domain</b> i <b style="color:var(--ink)">token</b> w <code>js/shopify.js</code> (instrukcja w <code>shopify/HEADLESS.md</code>).</p>
                   <div style="margin-top:22px"><a href="#/sklep" class="btn btn--primary">Wróć do sklepu ${icons.arrowRight({ s: 18 })}</a></div>
                 </div></section>`,
        after: () => {},
      };
    }

    const subtotal = Store.cartSubtotal();
    const shipping = shipCost(subtotal);
    const total = subtotal + shipping;

    const html = `
      <section class="section section--tight wrap page-enter">
        <a href="#/sklep" class="back-link">${icons.arrowLeft({ s: 16 })} Kontynuuj zakupy</a>
        <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem);margin:16px 0 20px">Kasa</h1>
        <ol class="steps-bar">
          <li class="done">${icons.check({ s: 14 })} Koszyk</li>
          <li class="current">2. Dane i dostawa</li>
          <li>3. Potwierdzenie</li>
        </ol>
        <div class="checkout">
          <form id="checkoutForm" novalidate>
            <h3 style="margin-bottom:16px">Dane kontaktowe</h3>
            <div class="form-grid form-grid--2">
              <div class="field"><label for="fName">Imię i nazwisko</label><input class="input" id="fName" required placeholder="Jan Kowalski"/><div class="field__err" data-err="fName"></div></div>
              <div class="field"><label for="fEmail">E-mail</label><input class="input" id="fEmail" type="email" required placeholder="jan@example.com"/><div class="field__err" data-err="fEmail"></div></div>
            </div>

            <h3 style="margin:28px 0 16px">Adres dostawy</h3>
            <div class="form-grid">
              <div class="field"><label for="fStreet">Ulica i numer</label><input class="input" id="fStreet" required placeholder="ul. Przykładowa 12/3"/><div class="field__err" data-err="fStreet"></div></div>
              <div class="form-grid form-grid--2">
                <div class="field"><label for="fZip">Kod pocztowy</label><input class="input" id="fZip" required placeholder="70-001"/><div class="field__err" data-err="fZip"></div></div>
                <div class="field"><label for="fCity">Miasto</label><input class="input" id="fCity" required placeholder="Szczecin"/><div class="field__err" data-err="fCity"></div></div>
              </div>
              <div class="field"><label for="fPhone">Telefon</label><input class="input" id="fPhone" placeholder="+48 555 123 456"/></div>
            </div>

            <h3 style="margin:28px 0 16px">Płatność</h3>
            <div class="pay-methods">
              <span>Przelewy24</span><span>BLIK</span><span>Visa</span><span>Mastercard</span><span>Apple Pay</span>
            </div>
            <div class="pay-note">${icons.info({ s: 18 })}<div>To wersja demonstracyjna — realna bramka (Przelewy24 / Stripe) podpina się w Shopify lub przez klucz API. Żadna płatność nie zostanie pobrana.</div></div>
          </form>

          <aside class="checkout__summary">
            <div class="osum-head">
              <h3>Twoje zamówienie</h3>
              <a href="#/sklep" class="osum-edit">Edytuj</a>
            </div>
            ${lines.map((l) => `
              <div class="osum-line">
                <div class="osum-thumb">
                  <img src="${esc(l.product.image)}" alt="${esc(l.product.title)}"/>
                  <span class="osum-qty">${l.qty}</span>
                </div>
                <div>
                  <div class="osum-title">${esc(l.product.title)}</div>
                  <div class="muted" style="font-size:.8rem">Rozmiar ${l.size}</div>
                </div>
                <div class="osum-price">${money(l.lineTotal)}</div>
              </div>`).join("")}

            <div style="margin-top:18px">
              <div class="summary-row"><span>Suma częściowa</span><span>${money(subtotal)}</span></div>
              <div class="summary-row"><span>Dostawa</span><span>${shipping === 0 ? "Gratis" : money(shipping)}</span></div>
              ${shipping === 0 ? `<div class="osum-free">${icons.check({ s: 15 })} Darmowa dostawa</div>` : ""}
              <div class="summary-row summary-row--total"><span>Razem</span><span>${money(total)}</span></div>
            </div>

            <button type="submit" form="checkoutForm" class="btn btn--accent btn--lg btn--block" id="placeOrder">Złóż zamówienie · ${money(total)}</button>

            <div class="drawer__trust" style="justify-content:space-between">
              <span>${icons.shield({ s: 15 })} Bezpieczna płatność</span>
              <span>${icons.truck({ s: 15 })} Wysyłka 48h</span>
              <span>${icons.box({ s: 15 })} 14 dni na zwrot</span>
            </div>
          </aside>
        </div>
      </section>`;

    const after = () => {
      const form = $("#checkoutForm");
      const setErr = (id, msg) => { $("#" + id).closest(".field").classList.toggle("invalid", !!msg); $(`[data-err="${id}"]`).textContent = msg || ""; };
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const req = [["fName", 2], ["fEmail", 0], ["fStreet", 3], ["fZip", 3], ["fCity", 2]];
        let ok = true;
        req.forEach(([id, min]) => {
          const v = $("#" + id).value.trim();
          if (id === "fEmail") { if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { setErr(id, "Podaj poprawny e-mail."); ok = false; } else setErr(id, ""); }
          else if (v.length < min) { setErr(id, "To pole jest wymagane."); ok = false; } else setErr(id, "");
        });
        if (!ok) return;
        const customer = { name: $("#fName").value.trim(), email: $("#fEmail").value.trim(), phone: $("#fPhone").value.trim() };
        const shippingAddr = { street: $("#fStreet").value.trim(), zip: $("#fZip").value.trim(), city: $("#fCity").value.trim() };
        const order = Store.createOrder({ ...customer, address: shippingAddr }, shipping);
        lastOrder = order;
        Store.clearCart();
        location.hash = "#/potwierdzenie";
      });
    };

    return { html, after };
  }

  /* ======================= POTWIERDZENIE ================================= */
  function confirmation() {
    if (!lastOrder) return { html: emptyState("Brak zamówienia", "Nie znaleźliśmy świeżego zamówienia.", "#/sklep", "Do sklepu"), after: () => {} };
    const o = lastOrder;
    const html = `
      <section class="section wrap page-enter" style="max-width:720px">
        <div style="text-align:center;margin-bottom:36px">
          <div style="width:76px;height:76px;border-radius:50%;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;margin:0 auto 22px" class="reveal">${icons.check({ s: 40, w: 2 })}</div>
          <h1 class="display" style="font-size:clamp(2rem,4vw,2.8rem)">Dziękujemy za zamówienie!</h1>
          <p class="muted" style="margin-top:10px">Numer zamówienia <b style="color:var(--ink)">${esc(o.number)}</b>. Potwierdzenie wysłaliśmy na ${esc(o.customer.email)}.</p>
        </div>
        <div style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card);padding:clamp(20px,3vw,28px)">
          ${o.items.map((it) => {
            const prod = Store.getProduct(it.id);
            return `
            <div class="osum-line">
              <div class="osum-thumb">
                <img src="${esc(prod ? prod.image : "assets/posters/placeholder.svg")}" alt="${esc(it.title)}"/>
                <span class="osum-qty">${it.qty}</span>
              </div>
              <div>
                <div class="osum-title">${esc(it.title)}</div>
                <div class="muted" style="font-size:.8rem">Rozmiar ${it.size}</div>
              </div>
              <div class="osum-price">${money(it.lineTotal)}</div>
            </div>`;
          }).join("")}
          <div class="summary-row" style="margin-top:16px"><span>Dostawa</span><span>${o.shippingCost === 0 ? "Gratis" : money(o.shippingCost)}</span></div>
          <div class="summary-row summary-row--total"><span>Razem</span><span>${money(o.total)}</span></div>
          <div style="border-top:1px solid var(--line);padding-top:16px;margin-top:4px">
            <div class="muted" style="font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Adres dostawy</div>
            <div style="font-size:.94rem">${esc(o.customer.name)}<br/>${esc(o.customer.address ? o.customer.address.street : "")}<br/>${esc(o.customer.address ? o.customer.address.zip + " " + o.customer.address.city : "")}</div>
          </div>
        </div>

        <h2 style="font-size:1.3rem;margin:38px 0 18px">Co dalej?</h2>
        <div class="next-steps">
          <div><span>${icons.mail({ s: 20 })}</span><b>Potwierdzenie</b><p>E-mail z podsumowaniem jest już w drodze na Twoją skrzynkę.</p></div>
          <div><span>${icons.palette({ s: 20 })}</span><b>Druk</b><p>Drukujemy Twój plakat na zamówienie, w ciągu 1–2 dni roboczych.</p></div>
          <div><span>${icons.truck({ s: 20 })}</span><b>Wysyłka</b><p>Nadajemy w sztywnej tubie i wysyłamy numer do śledzenia.</p></div>
        </div>

        <div style="text-align:center;margin-top:36px">
          <a href="#/sklep" class="btn btn--primary btn--lg">Wróć do sklepu <span class="btn__icon">${icons.arrowUpRight({ s: 15 })}</span></a>
        </div>
      </section>`;
    return { html, after: () => {} };
  }

  /* ======================= 404 / puste =================================== */
  function notFound() {
    return { html: emptyState("404", "Nie znaleźliśmy takiej strony.", "#/", "Strona główna"), after: () => {} };
  }
  function emptyState(title, text, href, cta) {
    return `
      <section class="section wrap page-enter" style="text-align:center;min-height:52vh;display:grid;place-content:center">
        <h1 class="display" style="font-size:clamp(3rem,10vw,6rem)">${esc(title)}</h1>
        <p class="muted" style="margin:12px 0 26px">${esc(text)}</p>
        <div><a href="${href}" class="btn btn--primary">${esc(cta)}</a></div>
      </section>`;
  }

  function plural(n, one, few, many) {
    if (n === 1) return one;
    const d = n % 10, h = n % 100;
    if (d >= 2 && d <= 4 && (h < 10 || h >= 20)) return few;
    return many;
  }

  return { home, shop, product, about, contact, checkout, confirmation, notFound };
})();
