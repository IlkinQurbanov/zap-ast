/* Product detail page */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  function stepper(id, max) {
    return `<div class="qty" data-qty>
      <button type="button" data-step="-1" aria-label="Sayı azalt">${TP.icon("minus", 18)}</button>
      <label class="sr-only" for="${id}">Say</label>
      <input id="${id}" type="number" inputmode="numeric" min="1" max="${max}" value="${max ? (max >= 4 ? 4 : 1) : 0}">
      <button type="button" data-step="1" aria-label="Sayı artır">${TP.icon("plus", 18)}</button>
    </div>`;
  }

  function wireStepper(root, onChange) {
    const input = root.querySelector("input");
    const max = Number(input.max) || 1;
    const clamp = (v) => Math.max(1, Math.min(max, Math.floor(Number(v)) || 1));
    const sync = () => {
      root.querySelector('[data-step="-1"]').disabled = Number(input.value) <= 1;
      root.querySelector('[data-step="1"]').disabled = Number(input.value) >= max;
      onChange(Number(input.value));
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-step]");
      if (!b) return;
      input.value = clamp(Number(input.value) + Number(b.dataset.step));
      sync();
    });
    input.addEventListener("change", () => { input.value = clamp(input.value); sync(); });
    sync();
    return () => Number(input.value);
  }

  function perks(p) {
    return `<ul class="perks" role="list">
      <li>${TP.icon("truck", 20)}<div><b>Ünvana çatdırılma</b><span>${TP.money(TP.pricing.DELIVERY_FEE)}, ${TP.money(TP.pricing.FREE_DELIVERY_FROM)}-dan yuxarı pulsuz (demo tarif)</span></div></li>
      <li>${TP.icon("store", 20)}<div><b>Filialdan götürmə — pulsuz</b><span>${TP.data.branches.length} demo filialdan seçin, hazır olanda bildiriş alın</span></div></li>
      <li>${TP.icon("shield", 20)}<div><b>Zəmanət</b><span>${esc(p.warranty)}</span></div></li>
      ${p.category === "tyres" ? `<li>${TP.icon("wrench", 20)}<div><b>Quraşdırma və balans</b><span>Sifariş zamanı servis vaxtı seçə bilərsiniz. <a class="link" href="booking.html?service=mount">Rezervasiya</a></span></div></li>` : ""}
      ${p.category === "batteries" ? `<li>${TP.icon("wrench", 20)}<div><b>Akkumulyator quraşdırılması</b><span><a class="link" href="booking.html?service=battery">Filialda vaxt seçin</a></span></div></li>` : ""}
    </ul>`;
  }

  const FIT_CATS = ["tyres", "batteries", "oils"];
  const FIT_HINT = { tyres: "ölçünü", batteries: "tutumu (Ah)", oils: "özlülüyü" };

  function fitCheck(p) {
    if (!FIT_CATS.includes(p.category)) return "";
    return `<section class="fit-check" aria-labelledby="fit-title">
      <h2 id="fit-title" class="panel__title panel__title--flush">${TP.icon("car", 22)}Avtomobilimə uyğundurmu?</h2>
      <div class="fit-check__fields">
        <div class="field"><label class="sr-only" for="fit-make">Marka</label><select class="select" id="fit-make"></select></div>
        <div class="field"><label class="sr-only" for="fit-model">Model</label><select class="select" id="fit-model"></select></div>
        <div class="field"><label class="sr-only" for="fit-year">İl</label><select class="select" id="fit-year"></select></div>
      </div>
      <div class="fit-result fit-result--info" data-fit-result aria-live="polite">${TP.icon("info", 18)}<span>Avtomobili seçin — ${FIT_HINT[p.category]} demo uyğunluq cədvəli ilə müqayisə edəcəyik.</span></div>
    </section>`;
  }

  function render(p) {
    const views = TP.mediaViews(p);
    const maxQty = TP.cart.limit(p.id);
    const out = p.stock <= 0;
    const favOn = TP.fav.has(p.id);
    const quick = p.category === "tyres"
      ? [["En", p.width], ["Profil", p.profile], ["Diametr", "R" + p.diameter], ["İndeks", `${p.load}${p.speed}`]]
      : TP.specRows(p).slice(0, 4).map(([k, v]) => [k, v]);
    const name = p.category === "tyres" ? `${p.name} ${p.size} ${p.load}${p.speed}` : p.name;

    return `
      <nav class="breadcrumb" aria-label="Breadcrumb"><ol>
        <li><a href="index.html">Ana səhifə</a></li>
        <li><a href="catalog.html?cat=${esc(p.category)}">${esc(TP.data.catName(p.category))}</a></li>
        ${p.sub && TP.data.subName(p.category, p.sub) ? `<li><a href="catalog.html?cat=${esc(p.category)}&sub=${esc(p.sub)}">${esc(TP.data.subName(p.category, p.sub))}</a></li>` : ""}
        <li><span aria-current="page">${esc(p.name)}</span></li>
      </ol></nav>
      <div class="pdp">
        <div class="gallery">
          <div class="gallery__main" data-gallery-main>${TP.media(p, "main")}<span class="gallery__label" data-gallery-label>${esc(views[0].label)}</span></div>
          <div class="gallery__thumbs" role="group" aria-label="Məhsul görünüşləri">
            ${views.map((v, i) => `<button type="button" class="gallery__thumb" data-view="${v.key}" aria-current="${i === 0}" aria-label="${esc(v.label)}">${TP.media(p, v.key)}</button>`).join("")}
          </div>
        </div>
        <div class="pdp__info">
          <div class="stack-sm">
            <span class="pdp__brand" lang="en">${esc(p.brand)}</span>
            <h1 class="pdp__title">${esc(name)}</h1>
            <div class="pdp__meta">
              <span>Kod: <span class="mono">${esc(p.sku)}</span></span>
              ${TP.seasonBadge(p)}
              ${p.runflat ? '<span class="badge badge--neutral">Run-flat</span>' : ""}
              ${TP.discount(p) ? `<span class="badge badge--sale">−${TP.discount(p)}%</span>` : ""}
            </div>
          </div>
          <div class="pdp__quick">${quick.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>
          <div class="buybox">
            <div class="buybox__row buybox__row--split">${TP.price(p, { size: "lg" })}${TP.stockBadge(p)}</div>
            ${p.category === "tyres" ? '<p class="muted fine">Qiymət 1 ədəd üçündür. Dəst üçün adətən 4 ədəd seçilir.</p>' : ""}
            <div class="buybox__row">
              ${out ? "" : stepper("pdp-qty", maxQty)}
              <button type="button" class="btn ${out ? "btn--outline" : "btn--primary"} btn--lg" data-pdp-add ${out ? "disabled" : ""}>${out ? "Stokda yoxdur" : `${TP.icon("cart", 20)}Səbətə əlavə et`}</button>
              <button type="button" class="icon-btn fav-btn" data-action="fav" data-id="${esc(p.id)}" aria-pressed="${favOn}" aria-label="${favOn ? "Favoritlərdən çıxar" : "Favoritlərə əlavə et"}: ${esc(p.name)}">${TP.icon("heart", 22)}</button>
            </div>
            ${out ? "" : '<span class="buybox__total" data-pdp-total aria-live="polite"></span>'}
            <div class="notice notice--demo">${TP.icon("info", 18)}<span>Qiymət və stok prototip üçün nümunədir.</span></div>
          </div>
          ${perks(p)}
          ${fitCheck(p)}
        </div>
      </div>
      <section class="pdp-tabs tabs" aria-label="Məhsul məlumatı">
        <div class="tabs__list" role="tablist">
          <button type="button" class="tab" role="tab" id="tab-spec" aria-controls="panel-spec" aria-selected="true">Texniki xüsusiyyətlər</button>
          <button type="button" class="tab" role="tab" id="tab-desc" aria-controls="panel-desc" aria-selected="false" tabindex="-1">Təsvir</button>
          <button type="button" class="tab" role="tab" id="tab-rev" aria-controls="panel-rev" aria-selected="false" tabindex="-1">Rəylər (0)</button>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-spec" aria-labelledby="tab-spec" tabindex="0">
          <div class="desc-grid">
            <div class="table-wrap"><table class="spec-table"><caption class="sr-only">Texniki xüsusiyyətlər</caption><tbody>
              ${TP.specRows(p).map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
            </tbody></table></div>
            ${p.category === "tyres" ? `<div class="eu-label-inline"><h3 class="sr-only">EU təkər etiketi</h3>${TP.media(p, "label")}</div>` : ""}
          </div>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-desc" aria-labelledby="tab-desc" tabindex="0" hidden>
          <div class="prose"><p>${esc(p.description)}</p><h3>Əsas üstünlüklər</h3><ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
        </div>
        <div class="tabs__panel" role="tabpanel" id="panel-rev" aria-labelledby="tab-rev" tabindex="0" hidden>
          <div class="empty"><span class="empty__icon">${TP.icon("star", 28)}</span><h3>Bu məhsul üçün hələ rəy yoxdur</h3><p>Rəylər real alıcılardan toplanacaq. Prototipdə uydurma rəy və reytinq göstərilmir.</p><button type="button" class="btn btn--outline" data-write-review>Rəy yaz</button></div>
        </div>
      </section>
      <section class="section section--tight" aria-labelledby="similar-title">
        <div class="section-head"><div class="section-head__text"><h2 id="similar-title">Oxşar məhsullar</h2></div><a class="link" href="catalog.html?cat=${esc(p.category)}">Hamısına bax →</a></div>
        <div class="product-grid" data-similar></div>
      </section>`;
  }

  function wireTabs(root) {
    const tabs = TP.$$('[role="tab"]', root);
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        TP.$("#" + t.getAttribute("aria-controls")).hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  }

  function reviewModal(p) {
    const form = document.createElement("form");
    form.className = "stack";
    form.innerHTML = `
      <p class="muted">${esc(p.name)} haqqında təcrübənizi paylaşın.</p>
      <div class="field"><label for="rv-name">Adınız<span class="req">*</span></label><input class="input" id="rv-name" name="name" required minlength="2" autocomplete="name"></div>
      <div class="field"><label for="rv-rate">Qiymətləndirmə<span class="req">*</span></label>
        <select class="select" id="rv-rate" name="rating" required><option value="">Seçin</option><option>5 — Əla</option><option>4 — Yaxşı</option><option>3 — Orta</option><option>2 — Zəif</option><option>1 — Pis</option></select></div>
      <div class="field"><label for="rv-text">Rəy<span class="req">*</span></label><textarea class="textarea" id="rv-text" name="text" required minlength="10"></textarea></div>
      <button type="submit" class="btn btn--primary btn--lg">Rəyi göndər</button>
      <div class="notice notice--demo">${TP.icon("info", 18)}<span>Demo: rəy heç yerə göndərilmir və səhifədə dərc olunmur.</span></div>`;
    const m = TP.modal({ title: "Rəy yaz", content: form });
    TP.forms.bind(form, { onSuccess: () => { m.close(); TP.toast({ title: "Rəy yoxlanıldı", text: "Demo rejim: rəy moderasiyaya göndərilməyib." }); } });
  }

  TP.pages.product = () => {
    const host = TP.$("[data-pdp]");
    if (!host) return;
    const id = TP.params().get("id");
    const p = id ? TP.data.byId(id) : null;
    if (!p) {
      host.innerHTML = `<div class="empty empty--page"><span class="empty__icon">${TP.icon("search", 28)}</span><h1>Məhsul tapılmadı</h1><p>Link köhnə ola bilər və ya məhsul kataloqdan çıxarılıb.</p><a class="btn btn--primary" href="catalog.html">Kataloqa keç</a></div>`;
      return;
    }
    host.innerHTML = render(p);
    const fullName = p.category === "tyres" ? `${p.name} ${p.size} ${p.load}${p.speed}` : p.name;
    document.title = `${fullName} — Zapçast.az`;
    const md = TP.$('meta[name="description"]');
    if (md) md.setAttribute("content", `${fullName}: ${p.description}`.slice(0, 158));

    // Gallery
    const main = TP.$("[data-gallery-main]", host);
    const views = TP.mediaViews(p);
    TP.$$("[data-view]", host).forEach((b) => b.addEventListener("click", () => {
      TP.$$("[data-view]", host).forEach((x) => x.setAttribute("aria-current", String(x === b)));
      main.innerHTML = TP.media(p, b.dataset.view) + `<span class="gallery__label" data-gallery-label></span>`;
      main.querySelector("[data-gallery-label]").textContent = views.find((v) => v.key === b.dataset.view).label;
    }));

    // Qty + add
    const qtyRoot = TP.$("[data-qty]", host);
    const totalEl = TP.$("[data-pdp-total]", host);
    let getQty = () => 1;
    if (qtyRoot) getQty = wireStepper(qtyRoot, (q) => { if (totalEl) totalEl.textContent = `${q} əd. × ${TP.money(p.price)} = ${TP.money(q * p.price)}`; });
    const addBtn = TP.$("[data-pdp-add]", host);
    if (addBtn && !addBtn.disabled) addBtn.addEventListener("click", () => {
      const res = TP.addToCart(p.id, getQty());
      if (res.ok) TP.openCartDrawer && TP.openCartDrawer(addBtn);
    });

    wireTabs(host);
    const rv = TP.$("[data-write-review]", host);
    if (rv) rv.addEventListener("click", () => reviewModal(p));

    // Fit check (tyres, batteries, oils)
    if (FIT_CATS.includes(p.category)) {
      const out = TP.$("[data-fit-result]", host);
      const have = { tyres: p.size, batteries: `${p.capacity} Ah`, oils: p.viscosity }[p.category];
      const noun = { tyres: "təkər", batteries: "akkumulyator", oils: "yağ" }[p.category];
      TP.vehicleSelector({ make: TP.$("#fit-make"), model: TP.$("#fit-model"), year: TP.$("#fit-year") }, (res) => {
        if (!res) { out.className = "fit-result fit-result--info"; out.innerHTML = `${TP.icon("info", 18)}<span>Avtomobili seçin — ${FIT_HINT[p.category]} demo uyğunluq cədvəli ilə müqayisə edəcəyik.</span>`; return; }
        const need = TP.vehicleNeeds(res)[p.category];
        const ok = need.match(p);
        out.className = `fit-result ${ok ? "fit-result--ok" : "fit-result--no"}`;
        out.innerHTML = ok
          ? `${TP.icon("check", 18)}<span>${esc(res.label)}: ${esc(need.label.toLocaleLowerCase("az"))} ${esc(need.value)} — bu ${noun} uyğundur.</span>`
          : `${TP.icon("alert", 18)}<span>${esc(res.label)}: ${esc(need.label.toLocaleLowerCase("az"))} ${esc(need.value)}. Bu məhsul ${esc(have)}-dir. <a class="link" href="${need.href}">Uyğun məhsullara bax</a></span>`;
      });
    }

    // Similar
    const same = TP.data.products.filter((x) => x.id !== p.id && x.category === p.category);
    const sim = same.sort((a, b) => {
      const sa = p.category === "tyres" ? (a.size === p.size) * 2 + (a.season === p.season) : 0;
      const sb = p.category === "tyres" ? (b.size === p.size) * 2 + (b.season === p.season) : 0;
      return sb - sa || b.popularity - a.popularity;
    }).slice(0, 4);
    TP.renderGrid(TP.$("[data-similar]", host), sim);
  };
})();
