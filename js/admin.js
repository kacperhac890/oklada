/* ============================================================================
   admin.js  —  Panel sklepu (demo).
   Zakładki: Pulpit / Produkty / Zamówienia / Wiadomości.
   CRUD produktów z uploadem obrazka (data URL). Dane w localStorage.
   Bramka hasła jest DEMONSTRACYJNA (po stronie przeglądarki) — w produkcji
   panelem jest natywny panel Shopify. Hasło demo: „admin”.
   ========================================================================== */

const Admin = (() => {
  const { icons, money, esc, $, $$, toast } = UI;
  const DEMO_PASSWORD = "admin";
  let tab = "pulpit";
  let editingImage = ""; // bufor obrazka w modalu

  const isAuthed = () => sessionStorage.getItem("ps_admin_ok") === "1";

  function render() {
    if (!isAuthed()) return { html: loginView(), after: bindLogin };
    return { html: shell(), after: bindShell };
  }

  /* ---- Logowanie --------------------------------------------------------- */
  function loginView() {
    return `
      <div class="admin"><div class="admin__wrap">
        <div class="login-box page-enter">
          <div style="width:48px;height:48px;border-radius:10px;background:var(--ink);color:var(--paper);display:grid;place-items:center;margin-bottom:20px">${icons.lock({ s: 24 })}</div>
          <h1 style="font-size:1.5rem;margin-bottom:6px">Panel sklepu</h1>
          <p class="muted" style="font-size:.9rem;margin-bottom:22px">Wersja demo. Hasło: <b style="color:var(--ink)">admin</b></p>
          <form id="loginForm">
            <div class="field"><label for="pw">Hasło</label><input class="input" id="pw" type="password" placeholder="••••••" autofocus/><div class="field__err" data-err="pw"></div></div>
            <button class="btn btn--primary btn--block" style="margin-top:18px">Zaloguj ${icons.arrowRight({ s: 18 })}</button>
          </form>
          <a href="#/" class="link-underline muted" style="display:inline-block;margin-top:20px;font-size:.86rem">${icons.arrowRight({ s: 15 })} Wróć do sklepu</a>
        </div>
      </div></div>`;
  }
  function bindLogin() {
    $("#loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      if ($("#pw").value === DEMO_PASSWORD) { sessionStorage.setItem("ps_admin_ok", "1"); Router.reload(); }
      else { $("#pw").closest(".field").classList.add("invalid"); $('[data-err="pw"]').textContent = "Nieprawidłowe hasło."; }
    });
  }

  /* ---- Shell / zakładki -------------------------------------------------- */
  function shell() {
    const tabs = [
      ["pulpit", "Pulpit", "dashboard"],
      ["produkty", "Produkty", "grid"],
      ["zamowienia", "Zamówienia", "box"],
      ["wiadomosci", "Wiadomości", "mail"],
    ];
    const unread = Store.getMessages().filter((m) => !m.read).length;
    return `
      <div class="admin">
        <div class="admin__bar">
          <div class="admin__bar-inner">
            <a href="#/" class="brand"><span class="brand__mark"></span> OKŁADKA</a>
            <div class="admin__tabs">
              ${tabs.map(([id, label, ico]) => `
                <button class="admin__tab ${tab === id ? "active" : ""}" data-tab="${id}">
                  ${icons[ico]({ s: 17 })} ${label}${id === "wiadomosci" && unread ? ` <span class="tag" style="margin-left:2px">${unread}</span>` : ""}
                </button>`).join("")}
            </div>
            <div style="flex:1"></div>
            <a href="#/" class="mini-btn" style="border-color:rgba(255,255,255,.25);color:#fff">Podgląd sklepu</a>
            <button class="mini-btn" id="logoutBtn" style="border-color:rgba(255,255,255,.25);color:#fff">${icons.logout({ s: 16 })} Wyloguj</button>
          </div>
        </div>
        <div class="admin__wrap" id="adminContent">${renderTab()}</div>
      </div>`;
  }

  function bindShell() {
    $$(".admin__tab").forEach((b) => b.addEventListener("click", () => {
      tab = b.dataset.tab;
      if (tab === "wiadomosci") Store.markMessagesRead();
      Router.reload();
    }));
    $("#logoutBtn").addEventListener("click", () => { sessionStorage.removeItem("ps_admin_ok"); Router.reload(); });
    bindTab();
  }

  function renderTab() {
    if (tab === "pulpit") return dashboardTab();
    if (tab === "produkty") return productsTab();
    if (tab === "zamowienia") return ordersTab();
    if (tab === "wiadomosci") return messagesTab();
    return "";
  }
  function bindTab() {
    if (tab === "produkty") bindProducts();
    if (tab === "zamowienia" || tab === "pulpit") {
      $$("tr[data-order]").forEach((row) => row.addEventListener("click", () => openOrderModal(row.dataset.order)));
    }
    if (tab === "wiadomosci") {
      $$("[data-reply]").forEach((b) => b.addEventListener("click", () => openReplyModal(b.dataset.reply)));
    }
  }

  /* ---- Pulpit ------------------------------------------------------------ */
  function dashboardTab() {
    const products = Store.getProducts();
    const orders = Store.getOrders();
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const unread = Store.getMessages().filter((m) => !m.read).length;
    const recent = orders.slice(0, 5);
    return `
      <div class="admin__head"><h1>Pulpit</h1><span class="muted">${today()}</span></div>
      <div class="kpi-row">
        <div class="kpi"><span>Produkty</span><b>${products.length}</b></div>
        <div class="kpi"><span>Zamówienia</span><b>${orders.length}</b></div>
        <div class="kpi"><span>Przychód (demo)</span><b>${money(revenue)}</b></div>
        <div class="kpi"><span>Nowe wiadomości</span><b>${unread}</b></div>
      </div>
      <h3 style="margin-bottom:14px">Ostatnie zamówienia</h3>
      ${recent.length ? table(
        ["Numer", "Data", "Klient", "Pozycje", "Kwota"],
        recent.map((o) => `<tr class="clickable" data-order="${esc(o.number)}"><td><b>${esc(o.number)}</b></td><td>${date(o.createdAt)}</td><td>${esc(o.customer.name)}</td><td>${o.items.reduce((n, i) => n + i.qty, 0)}</td><td><b style="font-family:var(--font-display)">${money(o.total)}</b></td></tr>`).join("")
      ) : emptyRow("Brak zamówień. Złóż testowe zamówienie w sklepie.")}
    `;
  }

  /* ---- Produkty ---------------------------------------------------------- */
  function productsTab() {
    const products = Store.getProducts();
    const cats = Store.getCategories();
    return `
      <div class="admin__head">
        <div><h1>Produkty</h1><p class="muted" style="font-size:.9rem">${products.length} pozycji w katalogu</p></div>
        <div style="display:flex;gap:10px">
          <button class="mini-btn" id="resetCatalog">${icons.arrowRight({ s: 15 })} Przywróć katalog</button>
          <button class="btn btn--primary" id="addProduct">${icons.plus({ s: 18 })} Dodaj plakat</button>
        </div>
      </div>
      <table class="table">
        <thead><tr><th></th><th>Nazwa</th><th>Kategoria</th><th>Ceny (A4/A3/B2)</th><th>Wyróżniony</th><th style="text-align:right">Akcje</th></tr></thead>
        <tbody>
          ${products.map((p) => {
            const c = cats.find((x) => x.slug === p.category);
            return `<tr>
              <td><img class="table__img" src="${esc(p.image)}" alt=""/></td>
              <td><b>${esc(p.title)}</b><div class="muted" style="font-size:.78rem">${(p.tags || []).join(", ")}</div></td>
              <td><span class="tag">${esc(c ? c.name : p.category)}</span></td>
              <td style="font-family:var(--font-display)">${money(p.prices.A4)} / ${money(p.prices.A3)} / ${money(p.prices.B2)}</td>
              <td>${p.featured ? `<span class="tag">tak</span>` : `<span class="tag tag--muted">nie</span>`}</td>
              <td><div class="row-actions" style="justify-content:flex-end">
                <button class="mini-btn" data-edit="${p.id}">${icons.edit({ s: 15 })} Edytuj</button>
                <button class="mini-btn mini-btn--danger" data-del="${p.id}">${icons.trash({ s: 15 })}</button>
              </div></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>`;
  }

  function bindProducts() {
    $("#addProduct").addEventListener("click", () => openProductModal(null));
    $("#resetCatalog").addEventListener("click", () => {
      if (confirm("Przywrócić fabryczny katalog? Twoje zmiany w produktach zostaną nadpisane.")) {
        Store.resetCatalog(); toast("Przywrócono katalog domyślny"); Router.reload();
      }
    });
    $$("[data-edit]").forEach((b) => b.addEventListener("click", () => openProductModal(Store.getProduct(b.dataset.edit))));
    $$("[data-del]").forEach((b) => b.addEventListener("click", () => {
      const p = Store.getProduct(b.dataset.del);
      if (p && confirm(`Usunąć „${p.title}”?`)) { Store.deleteProduct(p.id); toast("Produkt usunięty"); Router.reload(); }
    }));
  }

  /* ---- Modal produktu ---------------------------------------------------- */
  function openProductModal(prod) {
    const cats = Store.getCategories();
    const isNew = !prod;
    const p = prod || { id: "", title: "", category: cats[0]?.slug, tags: [], image: "", featured: false, description: "", prices: { A4: 45, A3: 75, B2: 125 } };
    editingImage = p.image || "";

    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-overlay" id="pmOverlay">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal__head">
            <h3>${isNew ? "Nowy plakat" : "Edytuj plakat"}</h3>
            <button class="icon-btn" id="pmClose" aria-label="Zamknij">${icons.x()}</button>
          </div>
          <div class="modal__body">
            <div class="field" style="margin-bottom:18px">
              <label>Obrazek plakatu</label>
              <div class="img-drop">
                <img id="pmPreview" src="${esc(p.image)}" alt="" onerror="this.style.opacity=.2"/>
                <div style="flex:1">
                  <input class="input" id="pmImage" placeholder="assets/posters/nazwa.svg lub URL" value="${esc(p.image)}" style="margin-bottom:8px"/>
                  <label class="mini-btn" style="display:inline-flex;cursor:pointer">${icons.image({ s: 15 })} Wgraj z dysku
                    <input type="file" id="pmFile" accept="image/*" hidden/>
                  </label>
                  <small style="display:block;margin-top:6px">JPG/PNG/SVG. Wgrany plik zapisuje się w przeglądarce (data URL).</small>
                </div>
              </div>
            </div>

            <div class="form-grid form-grid--2">
              <div class="field"><label>Nazwa</label><input class="input" id="pmTitle" value="${esc(p.title)}" placeholder="Np. Porsche 911 GT3 RS"/></div>
              <div class="field"><label>Kategoria</label>
                <select class="select" id="pmCat">${cats.map((c) => `<option value="${c.slug}" ${c.slug === p.category ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>
              </div>
            </div>

            <div class="field" style="margin-top:18px"><label>Tagi (po przecinku)</label><input class="input" id="pmTags" value="${esc((p.tags || []).join(", "))}" placeholder="mercedes, amg, sport"/></div>

            <div class="field" style="margin-top:18px"><label>Opis</label><textarea class="textarea" id="pmDesc" placeholder="Krótki, konkretny opis…">${esc(p.description)}</textarea></div>

            <label style="font-size:.82rem;font-weight:700;display:block;margin:18px 0 10px">Ceny wg rozmiaru (zł)</label>
            <div class="price-grid">
              <div class="field"><label style="font-weight:500;color:var(--ink-3)">A4</label><input class="input" id="pmA4" type="number" min="0" value="${p.prices.A4}"/></div>
              <div class="field"><label style="font-weight:500;color:var(--ink-3)">A3</label><input class="input" id="pmA3" type="number" min="0" value="${p.prices.A3}"/></div>
              <div class="field"><label style="font-weight:500;color:var(--ink-3)">B2</label><input class="input" id="pmB2" type="number" min="0" value="${p.prices.B2}"/></div>
            </div>

            <label style="display:flex;align-items:center;gap:10px;margin-top:20px;cursor:pointer">
              <input type="checkbox" id="pmFeatured" ${p.featured ? "checked" : ""} style="width:18px;height:18px;accent-color:var(--accent)"/>
              <span>Pokaż jako wyróżniony na stronie głównej</span>
            </label>
          </div>
          <div class="modal__foot">
            <button class="btn btn--ghost" id="pmCancel">Anuluj</button>
            <button class="btn btn--primary" id="pmSave">${isNew ? "Dodaj plakat" : "Zapisz zmiany"}</button>
          </div>
        </div>
      </div>`;

    const overlay = $("#pmOverlay");
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => { overlay.classList.remove("show"); setTimeout(() => (root.innerHTML = ""), 320); };
    $("#pmClose").addEventListener("click", close);
    $("#pmCancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    $("#pmImage").addEventListener("input", (e) => { editingImage = e.target.value; $("#pmPreview").src = editingImage; });
    $("#pmFile").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => { editingImage = reader.result; $("#pmPreview").src = editingImage; $("#pmImage").value = "(wgrany plik)"; };
      reader.readAsDataURL(file);
    });

    $("#pmSave").addEventListener("click", () => {
      const title = $("#pmTitle").value.trim();
      if (!title) { toast("Podaj nazwę plakatu", "info"); return; }
      let image = editingImage;
      if (image === "(wgrany plik)") image = editingImage; // już data URL w buforze
      const saved = {
        id: p.id || uniqueId(title),
        title,
        category: $("#pmCat").value,
        tags: $("#pmTags").value.split(",").map((t) => t.trim()).filter(Boolean),
        image: image || "assets/posters/placeholder.svg",
        featured: $("#pmFeatured").checked,
        description: $("#pmDesc").value.trim(),
        prices: { A4: num($("#pmA4").value, 45), A3: num($("#pmA3").value, 75), B2: num($("#pmB2").value, 125) },
      };
      Store.upsertProduct(saved);
      toast(p.id ? "Zapisano zmiany" : "Dodano plakat");
      close();
      Router.reload();
    });
  }

  /* ---- Zamówienia -------------------------------------------------------- */
  const statusTag = (s) => {
    const map = { "Nowe": "tag--new", "W realizacji": "tag--wip", "Wysłane": "tag--sent", "Zrealizowane": "tag--done", "Anulowane": "tag--void" };
    return map[s] || "tag--muted";
  };

  function ordersTab() {
    const orders = Store.getOrders();
    const revenue = orders.filter((o) => o.status !== "Anulowane").reduce((s, o) => s + o.total, 0);
    return `
      <div class="admin__head">
        <div><h1>Zamówienia</h1><p class="muted" style="font-size:.9rem">${orders.length} łącznie · ${money(revenue)} obrotu</p></div>
      </div>
      ${orders.length ? table(
        ["Numer", "Data", "Klient", "Szt.", "Kwota", "Status", ""],
        orders.map((o) => `<tr class="clickable" data-order="${esc(o.number)}">
          <td><b>${esc(o.number)}</b></td>
          <td>${date(o.createdAt)}</td>
          <td>${esc(o.customer.name)}<div class="muted" style="font-size:.78rem">${esc(o.customer.email)}</div></td>
          <td>${o.items.reduce((n, i) => n + i.qty, 0)}</td>
          <td><b style="font-family:var(--font-display)">${money(o.total)}</b></td>
          <td><span class="tag ${statusTag(o.status)}">${esc(o.status)}</span></td>
          <td style="text-align:right"><span class="mini-btn">Podgląd</span></td>
        </tr>`).join("")
      ) : emptyRow("Brak zamówień. Przejdź do sklepu i złóż testowe zamówienie.")}`;
  }

  /* ---- Podgląd zamówienia ------------------------------------------------ */
  function openOrderModal(number) {
    const o = Store.getOrders().find((x) => x.number === number);
    if (!o) return;
    const addr = o.customer.address || {};
    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-overlay" id="omOverlay">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Podgląd zamówienia">
          <div class="modal__head">
            <div>
              <h3>Zamówienie ${esc(o.number)}</h3>
              <div class="muted" style="font-size:.84rem">${date(o.createdAt)}</div>
            </div>
            <button class="icon-btn" id="omClose" aria-label="Zamknij">${icons.x()}</button>
          </div>
          <div class="modal__body">
            <div class="order-grid">
              <div>
                <h4>Klient</h4>
                <p>${esc(o.customer.name)}<br/>
                   <a href="mailto:${esc(o.customer.email)}">${esc(o.customer.email)}</a><br/>
                   ${esc(o.customer.phone || "—")}</p>
              </div>
              <div>
                <h4>Adres dostawy</h4>
                <p>${esc(addr.street || "—")}<br/>${esc((addr.zip || "") + " " + (addr.city || ""))}</p>
              </div>
            </div>

            <h4 style="margin:24px 0 10px">Pozycje</h4>
            ${o.items.map((it) => {
              const prod = Store.getProduct(it.id);
              return `<div class="osum-line">
                <div class="osum-thumb">
                  <img src="${esc(prod ? prod.image : "assets/posters/placeholder.svg")}" alt=""/>
                  <span class="osum-qty">${it.qty}</span>
                </div>
                <div>
                  <div class="osum-title">${esc(it.title)}</div>
                  <div class="muted" style="font-size:.8rem">Rozmiar ${it.size} · ${money(it.unit)} / szt.</div>
                </div>
                <div class="osum-price">${money(it.lineTotal)}</div>
              </div>`;
            }).join("")}

            <div style="margin-top:16px">
              <div class="summary-row"><span>Suma częściowa</span><span>${money(o.subtotal)}</span></div>
              <div class="summary-row"><span>Dostawa</span><span>${o.shippingCost === 0 ? "Gratis" : money(o.shippingCost)}</span></div>
              <div class="summary-row summary-row--total"><span>Razem</span><span>${money(o.total)}</span></div>
            </div>

            <div class="field" style="margin-top:20px">
              <label for="omStatus">Status realizacji</label>
              <select class="select" id="omStatus">
                ${Store.ORDER_STATUSES.map((s) => `<option ${s === o.status ? "selected" : ""}>${s}</option>`).join("")}
              </select>
            </div>
          </div>
          <div class="modal__foot">
            <a class="btn btn--ghost" href="mailto:${esc(o.customer.email)}?subject=${encodeURIComponent("Zamówienie " + o.number)}">Napisz do klienta</a>
            <button class="btn btn--primary" id="omSave">Zapisz status</button>
          </div>
        </div>
      </div>`;

    const overlay = $("#omOverlay");
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => { overlay.classList.remove("show"); setTimeout(() => (root.innerHTML = ""), 320); };
    $("#omClose").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    $("#omSave").addEventListener("click", () => {
      Store.updateOrderStatus(o.number, $("#omStatus").value);
      toast("Zaktualizowano status zamówienia");
      close();
      Router.reload();
    });
  }

  /* ---- Wiadomości -------------------------------------------------------- */
  function messagesTab() {
    const msgs = Store.getMessages();
    const open = msgs.filter((m) => !m.reply).length;
    return `
      <div class="admin__head">
        <div><h1>Wiadomości</h1><p class="muted" style="font-size:.9rem">${msgs.length} łącznie · ${open} bez odpowiedzi</p></div>
      </div>
      ${msgs.length ? `<div class="msg-list">${msgs.map((m) => `
        <div class="msg-card">
          <div class="msg-card__head">
            <div><b>${esc(m.name)}</b> <a href="mailto:${esc(m.email)}" class="muted" style="font-size:.86rem">${esc(m.email)}</a></div>
            <span class="muted" style="font-size:.82rem">${date(m.createdAt)}</span>
          </div>
          <div class="msg-card__tags">
            <span class="tag tag--muted">${esc(m.subject)}</span>
            ${m.reply ? `<span class="tag tag--done">Odpowiedziano</span>` : `<span class="tag tag--new">Oczekuje</span>`}
          </div>
          <p class="msg-card__body">${esc(m.message)}</p>
          ${m.reply ? `
            <div class="msg-reply">
              <div class="msg-reply__label">Twoja odpowiedź · ${date(m.repliedAt)}</div>
              <p>${esc(m.reply)}</p>
            </div>` : ""}
          <div class="msg-card__actions">
            <button class="btn btn--primary" data-reply="${esc(m.createdAt)}">${icons.mail({ s: 16 })} ${m.reply ? "Odpowiedz ponownie" : "Odpowiedz"}</button>
          </div>
        </div>`).join("")}</div>` : emptyRow("Brak wiadomości. Wyślij testową z zakładki Kontakt.")}`;
  }

  /* ---- Odpowiedź na wiadomość -------------------------------------------- */
  function openReplyModal(createdAt) {
    const m = Store.getMessages().find((x) => x.createdAt === createdAt);
    if (!m) return;
    const firstName = (m.name || "").trim().split(/\s+/)[0] || "";
    const draft = m.reply || `Cześć ${firstName},\n\ndziękujemy za wiadomość. `;
    const root = $("#modal-root");
    root.innerHTML = `
      <div class="modal-overlay" id="rmOverlay">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Odpowiedź na wiadomość">
          <div class="modal__head">
            <div>
              <h3>Odpowiedz — ${esc(m.name)}</h3>
              <div class="muted" style="font-size:.84rem">${esc(m.email)} · ${esc(m.subject)}</div>
            </div>
            <button class="icon-btn" id="rmClose" aria-label="Zamknij">${icons.x()}</button>
          </div>
          <div class="modal__body">
            <div class="msg-quote">
              <div class="msg-reply__label">Wiadomość klienta</div>
              <p>${esc(m.message)}</p>
            </div>
            <div class="field" style="margin-top:18px">
              <label for="rmText">Twoja odpowiedź</label>
              <textarea class="textarea" id="rmText" style="min-height:180px">${esc(draft)}</textarea>
            </div>
            <label class="rm-check">
              <input type="checkbox" id="rmMail" checked/>
              <span>Otwórz mój program pocztowy z gotową treścią (wysyłka do klienta)</span>
            </label>
          </div>
          <div class="modal__foot">
            <button class="btn btn--ghost" id="rmCancel">Anuluj</button>
            <button class="btn btn--primary" id="rmSend">Wyślij odpowiedź</button>
          </div>
        </div>
      </div>`;

    const overlay = $("#rmOverlay");
    requestAnimationFrame(() => overlay.classList.add("show"));
    const close = () => { overlay.classList.remove("show"); setTimeout(() => (root.innerHTML = ""), 320); };
    $("#rmClose").addEventListener("click", close);
    $("#rmCancel").addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    $("#rmSend").addEventListener("click", () => {
      const text = $("#rmText").value.trim();
      if (text.length < 3) { toast("Napisz treść odpowiedzi", "info"); return; }
      Store.replyToMessage(createdAt, text);
      if ($("#rmMail").checked) {
        const subject = "Re: " + (m.subject || "Twoja wiadomość");
        window.location.href = `mailto:${m.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      }
      toast("Odpowiedź zapisana");
      close();
      Router.reload();
    });

    setTimeout(() => { const t = $("#rmText"); if (t) { t.focus(); t.setSelectionRange(t.value.length, t.value.length); } }, 60);
  }

  /* ---- Pomocnicze -------------------------------------------------------- */
  function table(headers, rows) {
    return `<table class="table"><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
  }
  function emptyRow(text) {
    return `<div style="background:var(--surface);border:1px dashed var(--line-2);border-radius:var(--r-card);padding:50px;text-align:center;color:var(--ink-3)">${icons.box({ s: 36, w: 1.2 })}<p style="margin-top:12px">${esc(text)}</p></div>`;
  }
  const num = (v, d) => { const n = parseInt(v, 10); return isNaN(n) || n < 0 ? d : n; };
  function uniqueId(title) {
    let base = Store.slugify(title), id = base, i = 2;
    while (Store.getProduct(id)) id = `${base}-${i++}`;
    return id;
  }
  const date = (iso) => new Date(iso).toLocaleString("pl-PL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const today = () => new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return { render };
})();
