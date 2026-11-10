/* Cart page */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  function lineMarkup({ product: p, qty }) {
    const max = TP.cart.limit(p.id);
    return `
      <div class="cart-line" data-line="${esc(p.id)}">
        <a class="cart-line__media" href="${TP.productUrl(p)}" tabindex="-1" aria-hidden="true">${TP.media(p)}</a>
        <div class="cart-line__info">
          <span class="pcard__brand" lang="en">${esc(p.brand)}</span>
          <h3 class="cart-line__title"><a href="${TP.productUrl(p)}">${esc(p.name)}</a></h3>
          <span class="cart-line__meta">${esc(TP.data.sizeLabel(p))} · ${esc(p.sku)}</span>
          <div class="cluster">${TP.seasonBadge(p)}${TP.stockBadge(p)}</div>
          <div class="cart-line__controls">
            <div class="qty qty--sm">
              <button type="button" data-dec aria-label="${esc(p.name)}: sayı azalt" ${qty <= 1 ? "disabled" : ""}>${TP.icon("minus", 16)}</button>
              <label class="sr-only" for="q-${esc(p.id)}">${esc(p.name)} sayı</label>
              <input id="q-${esc(p.id)}" type="number" inputmode="numeric" min="1" max="${max}" value="${qty}" data-qty-input>
              <button type="button" data-inc aria-label="${esc(p.name)}: sayı artır" ${qty >= max ? "disabled" : ""}>${TP.icon("plus", 16)}</button>
            </div>
            <button type="button" class="remove-btn" data-remove-line>${TP.icon("trash", 16)}Sil</button>
            <button type="button" class="remove-btn fav-btn" data-action="fav" data-id="${esc(p.id)}" aria-pressed="${TP.fav.has(p.id)}">${TP.icon("heart", 16)}<span data-fav-text>${TP.fav.has(p.id) ? "Favoritlərdədir" : "Favoritlərə əlavə et"}</span></button>
          </div>
        </div>
        <div class="cart-line__side">
          <span class="cart-line__total">${TP.money(p.price * qty)}</span>
          <span class="cart-line__unit">${qty} × ${TP.money(p.price)}</span>
        </div>
      </div>`;
  }

  TP.orderTotals = (method = "address") => {
    const subtotal = TP.cart.subtotal();
    const code = TP.coupon.get();
    const discount = TP.pricing.discount(code, subtotal);
    const delivery = TP.pricing.delivery(method, subtotal - discount);
    return { subtotal, code, discount, delivery, total: Math.max(0, subtotal - discount + delivery), savings: TP.cart.savings() };
  };

  function render() {
    const lines = TP.$("[data-cart-lines]");
    const layout = TP.$("[data-cart-layout]");
    const empty = TP.$("[data-cart-empty]");
    const items = TP.cart.items();
    TP.$("[data-cart-heading-count]").textContent = items.length ? `${TP.cart.count()} məhsul` : "";
    if (!items.length) { layout.hidden = true; empty.hidden = false; renderCross(); return; }
    layout.hidden = false; empty.hidden = true;
    lines.innerHTML = items.map(lineMarkup).join("");

    const t = TP.orderTotals("address");
    const coupon = t.code && TP.pricing.COUPONS[t.code.toUpperCase()];
    TP.$("[data-cart-rows]").innerHTML = `
      <div class="summary-row"><span>Məhsullar (${TP.cart.count()} əd.)</span><span>${TP.money(t.subtotal)}</span></div>
      ${coupon ? `<div class="summary-row is-discount"><span>Kupon ${esc(coupon.label)}</span><span>−${TP.money(t.discount)}</span></div>` : ""}
      <div class="summary-row"><span>Ünvana çatdırılma (təxmini)</span><span>${t.delivery ? TP.money(t.delivery) : "Pulsuz"}</span></div>
      ${t.savings ? `<p class="fine is-discount">Kampaniya qiymətləri ilə qənaətiniz: ${TP.money(t.savings)}</p>` : ""}
      <p class="muted fine">Filialdan götürmə pulsuzdur. Çatdırılma üsulu növbəti addımda seçilir.</p>`;
    TP.$("[data-cart-total]").textContent = TP.money(t.total);
    const couponInput = TP.$("#coupon");
    if (couponInput && document.activeElement !== couponInput) couponInput.value = t.code || "";
    TP.$("[data-coupon-remove]").hidden = !coupon;
    renderCross();
  }

  function renderCross() {
    const grid = TP.$("[data-cart-cross]");
    if (!grid) return;
    const inCart = new Set(TP.cart.items().map((i) => i.id));
    const picks = TP.data.products.filter((p) => !inCart.has(p.id) && p.stock > 0 && p.category !== "tyres").sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    TP.renderGrid(grid, picks);
  }

  TP.pages.cart = () => {
    const lines = TP.$("[data-cart-lines]");
    if (!lines) return;
    lines.addEventListener("click", (e) => {
      const line = e.target.closest("[data-line]");
      if (!line) return;
      const id = line.dataset.line;
      if (e.target.closest("[data-inc]")) TP.cart.setQty(id, TP.cart.qtyOf(id) + 1);
      else if (e.target.closest("[data-dec]")) TP.cart.setQty(id, TP.cart.qtyOf(id) - 1);
      else if (e.target.closest("[data-remove-line]")) {
        const p = TP.data.byId(id);
        const qty = TP.cart.qtyOf(id);
        TP.cart.remove(id);
        const t = TP.toast({ type: "info", title: "Məhsul silindi", text: p.name, timeout: 5000 });
        const undo = document.createElement("button");
        undo.type = "button"; undo.className = "toast__action toast__undo"; undo.textContent = "Geri qaytar";
        undo.addEventListener("click", () => { TP.cart.add(id, qty); t.remove(); });
        t.querySelector(".toast__body").appendChild(undo);
      }
    });
    lines.addEventListener("change", (e) => {
      if (!e.target.matches("[data-qty-input]")) return;
      TP.cart.setQty(e.target.closest("[data-line]").dataset.line, Number(e.target.value));
    });

    const form = TP.$("[data-coupon-form]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = TP.$("#coupon");
      const code = input.value.trim().toUpperCase();
      const wrap = input.closest(".field");
      let err = wrap.querySelector(".field-error");
      if (err) err.remove();
      wrap.classList.remove("has-error");
      if (!code) { input.focus(); return; }
      if (!TP.pricing.COUPONS[code]) {
        err = document.createElement("p"); err.className = "field-error"; err.id = "coupon-err";
        err.textContent = "Bu kupon tapılmadı. Demo kodlar: DEMO10, QISH25.";
        wrap.appendChild(err); wrap.classList.add("has-error");
        input.setAttribute("aria-describedby", "coupon-err");
        return;
      }
      TP.coupon.set(code);
      TP.toast({ title: "Kupon tətbiq olundu", text: TP.pricing.COUPONS[code].label });
      render();
    });
    TP.$("[data-coupon-remove]").addEventListener("click", () => { TP.coupon.set(""); TP.$("#coupon").value = ""; render(); });

    TP.on("tp:cart", render);
    render();
  };
})();
