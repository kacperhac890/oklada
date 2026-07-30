/* ============================================================================
   generate-csv.mjs  —  Generuje plik importu produktów do Shopify z katalogu.
   Jedno źródło prawdy: ../js/data.js (te same produkty co w sklepie demo).

   Uruchomienie:  node generate-csv.mjs
   Wynik:         products_export.csv  (import: Shopify → Produkty → Importuj)
   ========================================================================== */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* Wczytujemy katalog z js/data.js bez duplikowania danych.
   Plik deklaruje const SIZES / DEFAULT_CATEGORIES / DEFAULT_PRODUCTS. */
const dataSrc = fs.readFileSync(path.join(__dirname, "..", "js", "data.js"), "utf8");
const { SIZES, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } = new Function(
  dataSrc + "\nreturn { SIZES, DEFAULT_CATEGORIES, DEFAULT_PRODUCTS };"
)();

const VENDOR = "OKŁADKA";
const catName = (slug) => (DEFAULT_CATEGORIES.find((c) => c.slug === slug) || {}).name || slug;
// Waga wysyłkowa (tuba) — wpływa na koszt kuriera w Shopify
const GRAMS = { A4: 120, A3: 180, B2: 320 };

const COLUMNS = [
  "Handle", "Title", "Body (HTML)", "Vendor", "Type", "Tags", "Published",
  "Option1 Name", "Option1 Value",
  "Variant SKU", "Variant Grams", "Variant Inventory Tracker", "Variant Inventory Qty",
  "Variant Inventory Policy", "Variant Fulfillment Service", "Variant Price",
  "Variant Requires Shipping", "Variant Taxable",
  "Image Src",
  "SEO Title", "SEO Description", "Status",
];

const esc = (v) => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (obj) => COLUMNS.map((c) => esc(obj[c] ?? "")).join(",");

function bodyHtml(p) {
  const sizes = SIZES.map((s) => `<li>${s.label} — ${s.dim}</li>`).join("");
  return [
    `<p>${p.description}</p>`,
    `<p><strong>Druk:</strong> błyszczący papier 200 g/m². Pakowane w sztywną tubę.</p>`,
    `<p><strong>Dostępne rozmiary:</strong></p><ul>${sizes}</ul>`,
  ].join("");
}
const seoDesc = (p) => p.description.replace(/\s+/g, " ").slice(0, 155);

const lines = [COLUMNS.join(",")];

for (const p of DEFAULT_PRODUCTS) {
  const tags = [catName(p.category), ...(p.tags || [])].join(", ");
  SIZES.forEach((s, i) => {
    const first = i === 0;
    lines.push(row({
      Handle: p.id,
      Title: first ? p.title : "",
      "Body (HTML)": first ? bodyHtml(p) : "",
      Vendor: first ? VENDOR : "",
      Type: first ? catName(p.category) : "",
      Tags: first ? tags : "",
      Published: first ? "TRUE" : "",
      "Option1 Name": first ? "Rozmiar" : "",
      "Option1 Value": s.code,
      "Variant SKU": `${p.id.toUpperCase()}-${s.code}`,
      "Variant Grams": GRAMS[s.code] ?? 150,
      "Variant Inventory Tracker": "",              // pusty = nie śledzimy stanu (druk na zamówienie)
      "Variant Inventory Qty": "",
      "Variant Inventory Policy": "deny",
      "Variant Fulfillment Service": "manual",
      "Variant Price": (p.prices[s.code] ?? 0).toFixed(2),
      "Variant Requires Shipping": "TRUE",
      "Variant Taxable": "TRUE",
      "Image Src": "",                              // puste = brak danych zdjęcia; dodajesz je w panelu (SHOPIFY.md, Krok 3)
      "SEO Title": first ? `${p.title} — plakat | ${VENDOR}` : "",
      "SEO Description": first ? seoDesc(p) : "",
      Status: first ? "active" : "",
    }));
  });
}

const out = path.join(__dirname, "products_export.csv");
fs.writeFileSync(out, "﻿" + lines.join("\n"), "utf8"); // BOM = poprawne polskie znaki w Excelu
console.log(`OK — ${DEFAULT_PRODUCTS.length} produktów, ${lines.length - 1} wierszy wariantów`);
console.log(`Zapisano: ${out}`);
