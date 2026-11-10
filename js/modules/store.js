/* Cart & favourites state, persisted in localStorage. */
(function () {
  "use strict";
  const TP = window.TP;
  const CART_KEY = "tp.cart.v1";
  const FAV_KEY = "tp.fav.v1";
  const MAX_QTY = 20;

  const clean = (items) =>
    (Array.isArray(items) ? items : [])
      .filter((i) => i && TP.data.byId(i.id))
      .map((i) => ({ id: i.id, qty: Math.max(1, Math.min(MAX_QTY, Math.floor(Number(i.qty) || 1))) }));

  let items = clean(TP.storage.get(CART_KEY, []));
  const save = () => { TP.storage.set(CART_KEY, items); TP.emit("tp:cart", { items: TP.cart.items() }); };
  const limitFor = (p) => Math.max(0, Math.min(MAX_QTY, p.stock));

  TP.cart = {
    items: () => items.map((i) => ({ ...i, product: TP.data.byId(i.id) })),
    count: () => items.reduce((s, i) => s + i.qty, 0),
    qtyOf: (id) => (items.find((i) => i.id === id) || {}).qty || 0,
    limit: (id) => { const p = TP.data.byId(id); return p ? limitFor(p) : 0; },
    add(id, qty = 1) {
      const p = TP.data.byId(id);
      if (!p || p.stock <= 0) return { ok: false, reason: "stock" };
      const line = items.find((i) => i.id === id);
      const max = limitFor(p);
      const current = line ? line.qty : 0;
      const next = Math.min(max, current + qty);
      if (next === current) return { ok: false, reason: "limit", max };
      if (line) line.qty = next; else items.push({ id, qty: next });
      save();
      return { ok: true, qty: next, capped: next < current + qty, max };
    },
    setQty(id, qty) {
      const line = items.find((i) => i.id === id);
      if (!line) return;
      const max = TP.cart.limit(id);
      line.qty = Math.max(1, Math.min(max || 1, Math.floor(qty) || 1));
      save();
    },
    remove(id) { items = items.filter((i) => i.id !== id); save(); },
    clear() { items = []; save(); },
    subtotal: () => TP.cart.items().reduce((s, i) => s + i.product.price * i.qty, 0),
    savings: () => TP.cart.items().reduce((s, i) => s + (i.product.oldPrice ? (i.product.oldPrice - i.product.price) * i.qty : 0), 0),
  };

  /* Demo pricing rules — prototype only. */
  TP.pricing = {
    FREE_DELIVERY_FROM: 300,
    DELIVERY_FEE: 10,
    COUPONS: { DEMO10: { type: "percent", value: 10, label: "DEMO10 (−10%)" }, QISH25: { type: "fixed", value: 25, label: "QISH25 (−25 ₼)" } },
    delivery(method, subtotal) {
      if (method === "pickup") return 0;
      return subtotal >= this.FREE_DELIVERY_FROM || subtotal === 0 ? 0 : this.DELIVERY_FEE;
    },
    discount(code, subtotal) {
      const c = this.COUPONS[String(code || "").toUpperCase()];
      if (!c) return 0;
      return c.type === "percent" ? Math.round(subtotal * c.value) / 100 : Math.min(subtotal, c.value);
    },
  };
  TP.coupon = {
    get: () => TP.storage.get("tp.coupon.v1", ""),
    set: (code) => TP.storage.set("tp.coupon.v1", code || ""),
  };

  let fav = (TP.storage.get(FAV_KEY, []) || []).filter((id) => TP.data.byId(id));
  TP.fav = {
    list: () => fav.slice(),
    has: (id) => fav.includes(id),
    count: () => fav.length,
    toggle(id) {
      fav = fav.includes(id) ? fav.filter((x) => x !== id) : [...fav, id];
      TP.storage.set(FAV_KEY, fav);
      TP.emit("tp:fav", { id, active: fav.includes(id) });
      return fav.includes(id);
    },
  };

  /* Keep tabs in sync */
  window.addEventListener("storage", (e) => {
    if (e.key === CART_KEY) { items = clean(TP.storage.get(CART_KEY, [])); TP.emit("tp:cart", { items: TP.cart.items() }); }
    if (e.key === FAV_KEY) { fav = TP.storage.get(FAV_KEY, []) || []; TP.emit("tp:fav", {}); }
  });
})();
