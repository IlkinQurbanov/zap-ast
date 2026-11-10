/* Zapçast core helpers — single global namespace `TP`. */
(function () {
  "use strict";
  const TP = (window.TP = window.TP || {});
  TP.pages = TP.pages || {};

  TP.$ = (sel, root = document) => root.querySelector(sel);
  TP.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /** Escape any value before placing it in an HTML template. */
  TP.esc = (value) =>
    String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const priceFmt = new Intl.NumberFormat("az-AZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  TP.money = (n) => {
    let s;
    try { s = priceFmt.format(n); } catch (e) { s = Number(n).toFixed(2); }
    return s + " ₼";
  };

  TP.params = () => new URLSearchParams(window.location.search);

  TP.debounce = (fn, ms = 200) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  TP.html = (str) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = str.trim();
    return tpl.content;
  };

  /** Safe storage: falls back to memory when localStorage is blocked. */
  const memory = {};
  TP.storage = {
    get(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set(key, value) {
      memory[key] = value;
      try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* memory only */ }
    },
  };

  TP.emit = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
  TP.on = (name, fn) => document.addEventListener(name, fn);

  /** Normalise Azerbaijani text for search matching. */
  TP.norm = (s) =>
    String(s || "")
      .toLocaleLowerCase("az")
      .replace(/ə/g, "e").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ü/g, "u")
      .replace(/ş/g, "s").replace(/ç/g, "c").replace(/ğ/g, "g")
      .replace(/\s+/g, " ")
      .trim();

  /** Parse a tyre size like "205/55 R16", "205 55 16", "205/55r16". */
  TP.parseSize = (q) => {
    const m = String(q || "").match(/(\d{3})\s*[\/\s-]\s*(\d{2})\s*(?:z?r)?\s*(\d{2})?/i);
    if (!m) return null;
    return { width: Number(m[1]), profile: Number(m[2]), diameter: m[3] ? Number(m[3]) : null };
  };

  let uid = 0;
  TP.uid = (prefix = "tp") => `${prefix}${++uid}`;

  TP.plural = (n, word) => `${n} ${word}`;
})();
