/* ProductCard, Price, StockBadge, SeasonBadge + delegated card actions. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  TP.productUrl = (p) => `product.html?id=${encodeURIComponent(p.id)}`;

  TP.price = (p, { size = "" } = {}) => {
    const sale = p.oldPrice && p.oldPrice > p.price;
    return `<div class="price ${size ? "price--" + size : ""}">
      <span class="price__now ${sale ? "is-sale" : ""}">${TP.money(p.price)}</span>
      ${sale ? `<span class="price__old"><span class="sr-only">Əvvəlki qiymət: </span>${TP.money(p.oldPrice)}</span>` : ""}
      ${p.unit ? `<span class="price__unit">/ ${esc(p.unit)}</span>` : ""}
    </div>`;
  };

  TP.stockBadge = (p) => {
    if (p.stock <= 0) return '<span class="stock stock--out">Stokda yoxdur</span>';
    if (p.stock <= 6) return `<span class="stock stock--low">Az qalıb · ${p.stock} əd.</span>`;
    return `<span class="stock stock--in">Stokda · ${p.stock} əd.</span>`;
  };

  TP.seasonBadge = (p) => {
    if (p.category !== "tyres") return "";
    const s = TP.data.SEASON[p.season];
    return `<span class="badge badge--${p.season}">${TP.icon(s.icon, 13)}${esc(s.label)}</span>`;
  };

  /* "Yeni" = the 8 most recently added products (demo ordering field `added`). */
  let newIds = null;
  TP.isNew = (p) => {
    if (!newIds) newIds = new Set(TP.data.products.slice().sort((a, b) => b.added - a.added).slice(0, 8).map((x) => x.id));
    return newIds.has(p.id);
  };

  TP.discount = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);

  TP.specRows = (p) => {
    switch (p.category) {
      case "tyres":
        return [
          ["En", `${p.width} mm`], ["Profil", `${p.profile}%`], ["Diametr", `R${p.diameter}`],
          ["Yük indeksi", String(p.load)], ["Sürət indeksi", p.speed], ["Mövsüm", TP.data.SEASON[p.season].label],
          ["Run-flat", p.runflat ? "Bəli" : "Xeyr"], ["İstehsalçı", p.brand], ["İstehsal ölkəsi", p.country || "Məlumat yoxdur"],
          ["Yanacaq səmərəliliyi", p.fuel], ["Yaş yolda tutuş", p.wet], ["Səs səviyyəsi", `${p.noise} dB`],
          ["DOT / istehsal tarixi", p.dot || "Məlumat yoxdur"],
        ];
      case "batteries":
        return [["Tutum", `${p.capacity} Ah`], ["Gərginlik", `${p.voltage} V`], ["Soyuq start (EN)", `${p.cca} A`], ["Texnologiya", p.tech], ["Polyarlıq", p.polarity], ["Ölçülər", p.dims], ["İstehsalçı", p.brand]];
      case "rims":
        return [["Diametr", `R${p.diameter}`], ["En", p.rimWidth], ["PCD", p.pcd], ["ET (vılet)", `${p.et} mm`], ["DIA", `${p.dia} mm`], ["Örtük", p.finish], ["İstehsalçı", p.brand]];
      case "oils":
        return [["Özlülük", p.viscosity], ["Həcm", `${p.volume} L`], ["Növ", p.oilType], ["Standart", p.spec], ["İstehsalçı", p.brand]];
      default:
        return [["Kod", p.sku], ["Uyğunluq", p.fits || "—"], ["İstehsalçı", p.brand]];
    }
  };

  TP.productCard = (p) => {
    const off = TP.discount(p);
    const favOn = TP.fav.has(p.id);
    const out = p.stock <= 0;
    const specs = p.category === "tyres"
      ? `<div class="pcard__specs" aria-label="EU etiketi">
           <span class="spec-pill" title="Yanacaq səmərəliliyi">${TP.icon("gauge", 12)}<b>${esc(p.fuel)}</b></span>
           <span class="spec-pill" title="Yaş yolda tutuş">${TP.icon("drop", 12)}<b>${esc(p.wet)}</b></span>
           <span class="spec-pill" title="Səs səviyyəsi">${TP.icon("volume", 12)}<b>${esc(p.noise)}</b> dB</span>
           ${p.runflat ? '<span class="spec-pill"><b>RF</b></span>' : ""}
         </div>`
      : p.category === "batteries"
      ? `<div class="pcard__specs" aria-label="Əsas göstəricilər">
           <span class="spec-pill" title="Tutum"><b>${esc(p.capacity)}</b> Ah</span>
           <span class="spec-pill" title="Soyuq start cərəyanı (EN)"><b>${esc(p.cca)}</b> A</span>
           <span class="spec-pill" title="Texnologiya"><b>${esc(p.tech)}</b></span>
         </div>`
      : p.category === "oils"
      ? `<div class="pcard__specs" aria-label="Əsas göstəricilər">
           <span class="spec-pill" title="Özlülük"><b>${esc(p.viscosity)}</b></span>
           <span class="spec-pill" title="Həcm"><b>${esc(p.volume)}</b> L</span>
           <span class="spec-pill" title="Növ">${esc(p.oilType)}</span>
         </div>`
      : "";
    return `
    <article class="pcard" data-id="${esc(p.id)}">
      <div class="pcard__badges">
        ${TP.isNew(p) ? '<span class="badge badge--new">Yeni</span>' : ""}
        ${off ? `<span class="badge badge--sale">−${off}%</span>` : ""}
        ${TP.seasonBadge(p)}
      </div>
      <button type="button" class="icon-btn pcard__fav fav-btn" data-action="fav" data-id="${esc(p.id)}" aria-pressed="${favOn}" aria-label="${favOn ? "Favoritlərdən çıxar" : "Favoritlərə əlavə et"}: ${esc(p.name)}">${TP.icon("heart", 20)}</button>
      <a class="pcard__media" href="${TP.productUrl(p)}" tabindex="-1" aria-hidden="true">${TP.media(p)}</a>
      <div class="pcard__body">
        <span class="pcard__brand" lang="en">${esc(p.brand)}</span>
        <h3 class="pcard__title"><a href="${TP.productUrl(p)}">${esc(p.model)}</a></h3>
        <span class="pcard__size">${esc(TP.data.sizeLabel(p))}</span>
        ${specs}
        <div class="pcard__foot">
          <div class="pcard__row">${TP.price(p)}</div>
          <div class="pcard__row">${TP.stockBadge(p)}</div>
          <button type="button" class="btn ${out ? "btn--outline" : "btn--primary"} btn--block" data-action="add" data-id="${esc(p.id)}" ${out ? "disabled" : ""}>
            ${out ? "Stokda yoxdur" : `${TP.icon("cart", 18)}<span>Səbətə at</span>`}
          </button>
        </div>
      </div>
    </article>`;
  };

  TP.renderGrid = (el, list) => {
    if (!el) return;
    el.innerHTML = list.map(TP.productCard).join("");
  };

  /** Shared add-to-cart feedback */
  TP.addToCart = (id, qty = 1) => {
    const p = TP.data.byId(id);
    const res = TP.cart.add(id, qty);
    if (res.ok) {
      TP.toast({
        title: "Səbətə əlavə olundu",
        text: `${p.name} · ${TP.data.sizeLabel(p)}${res.capped ? ` (maks. ${res.max} əd.)` : ""}`,
        action: { label: "Səbətə keç", href: "cart.html" },
      });
    } else if (res.reason === "limit") {
      TP.toast({ type: "info", title: "Stok limiti", text: `Bu məhsuldan maksimum ${res.max} ədəd sifariş etmək olar.` });
    } else {
      TP.toast({ type: "error", title: "Məhsul stokda yoxdur" });
    }
    return res;
  };

  const syncFavButtons = (id) => {
    TP.$$(`.fav-btn[data-id="${CSS.escape(id)}"]`).forEach((btn) => {
      const on = TP.fav.has(id);
      btn.setAttribute("aria-pressed", String(on));
      const p = TP.data.byId(id);
      if (btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", `${on ? "Favoritlərdən çıxar" : "Favoritlərə əlavə et"}: ${p.name}`);
      const text = btn.querySelector("[data-fav-text]");
      if (text) text.textContent = on ? "Favoritlərdədir" : "Favoritlərə əlavə et";
    });
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "add" && id) {
      e.preventDefault();
      TP.addToCart(id, 1);
    } else if (btn.dataset.action === "fav" && id) {
      e.preventDefault();
      const on = TP.fav.toggle(id);
      syncFavButtons(id);
      TP.toast({ type: on ? "success" : "info", title: on ? "Favoritlərə əlavə olundu" : "Favoritlərdən çıxarıldı", text: TP.data.byId(id).name, action: on ? { label: "Favoritlərə bax", href: "catalog.html?fav=1" } : null, timeout: 2600 });
    }
  });
})();
