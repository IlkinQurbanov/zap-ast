/* Home page */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  const opt = (v, l, sel) => `<option value="${esc(v)}" ${sel ? "selected" : ""}>${esc(l)}</option>`;
  const uniq = (cat, key) => Array.from(new Set(TP.data.products.filter((p) => p.category === cat).map((p) => p[key])))
    .sort((a, b) => (typeof a === "number" ? a - b : String(a).localeCompare(String(b))));

  /* Each finder form maps its fields to catalog filters and a live match count. */
  const FINDERS = {
    tyres: {
      setup(f) { TP.fillSizeSelects({ w: f.elements.w, p: f.elements.p, d: f.elements.d }, { w: 205, p: 55, d: 16 }); },
      test: (p, v) => (!v.w || p.width === +v.w) && (!v.p || p.profile === +v.p) && (!v.d || p.diameter === +v.d) && (!v.season || p.season === v.season),
      params: ["w", "p", "d", "season"],
      noun: "təkər",
    },
    batteries: {
      setup(f) { f.elements.ah.innerHTML = opt("", "Hamısı") + uniq("batteries", "capacity").map((x) => opt(x, `${x} Ah`, x === 60)).join(""); },
      test: (p, v) => (!v.ah || p.capacity === +v.ah) && (!v.tech || p.tech === v.tech) && (!v.pol || p.polarity === v.pol),
      params: ["ah", "tech"],
      noun: "akkumulyator",
    },
    oils: {
      setup(f) {
        f.elements.visc.innerHTML = opt("", "Hamısı") + uniq("oils", "viscosity").map((x) => opt(x, x, x === "5W-30")).join("");
        f.elements.otype.innerHTML = opt("", "Hamısı") + uniq("oils", "oilType").map((x) => opt(x, x)).join("");
      },
      test: (p, v) => (!v.visc || p.viscosity === v.visc) && (!v.otype || p.oilType === v.otype) && (!v.vol || p.volume === +v.vol),
      params: ["visc", "otype", "vol"],
      noun: "yağ",
    },
  };

  function wireFinderForm(form) {
    const cat = form.dataset.finderForm;
    const cfg = FINDERS[cat];
    cfg.setup(form);
    const countEl = form.querySelector("[data-finder-count]");
    const values = () => Object.fromEntries(new FormData(form).entries());
    const update = () => {
      const v = values();
      const n = TP.data.products.filter((p) => p.category === cat && cfg.test(p, v)).length;
      countEl.textContent = n ? `${n} uyğun ${cfg.noun} tapıldı` : `Bu seçim üzrə ${cfg.noun} yoxdur — parametrləri dəyişin`;
    };
    form.addEventListener("change", update);
    update();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = values();
      const q = new URLSearchParams({ cat });
      cfg.params.forEach((k) => { if (v[k]) q.set(k, v[k]); });
      window.location.href = `catalog.html?${q}`;
    });
  }

  function initFinder() {
    const root = TP.$("[data-finder]");
    if (!root) return;
    const tabs = TP.$$('[role="tab"]', root);
    const panels = TP.$$('[role="tabpanel"]', root);
    const select = (tab) => {
      tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p) => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
          select(next); next.focus();
        }
      });
    });
    TP.$$("[data-finder-form]", root).forEach(wireFinderForm);

    // Vehicle → tyre size, battery Ah and oil viscosity, each with its own catalog link
    const vForm = TP.$("#finder-vehicle", root);
    const out = TP.$("[data-vehicle-result]", root);
    const idle = out.innerHTML;
    vForm.addEventListener("submit", (e) => e.preventDefault());
    TP.vehicleSelector({ make: TP.$("#fv-make", root), model: TP.$("#fv-model", root), year: TP.$("#fv-year", root) }, (res) => {
      if (!res) { out.innerHTML = idle; return; }
      const needs = TP.vehicleNeeds(res);
      const icons = { tyres: "tyre", batteries: "battery", oils: "oil" };
      out.innerHTML = `<p class="finder__note">${esc(res.label)} üçün zavod parametrləri (demo cədvəl):</p>
        <div class="vehicle-needs__list">${Object.entries(needs).map(([cat, n]) => {
          const count = TP.data.products.filter(n.match).length;
          return `<a class="vehicle-need" href="${n.href}">
            <span class="vehicle-need__icon">${TP.icon(icons[cat], 20)}</span>
            <span class="vehicle-need__body"><span class="vehicle-need__label">${esc(n.label)}</span><b class="mono">${esc(n.value)}</b></span>
            <span class="vehicle-need__count">${count ? count + " məhsul" : "Yoxdur"}${TP.icon("arrow-right", 16)}</span>
          </a>`;
        }).join("")}</div>`;
    });
  }

  function initSections() {
    const trio = TP.$("[data-hero-trio]");
    if (trio) {
      const sample = (id) => TP.data.byId(id);
      trio.querySelector(".hero__trio-tyre").innerHTML = TP.heroTyre();
      trio.querySelector(".hero__trio-battery").innerHTML = TP.media(sample("b8"));
      trio.querySelector(".hero__trio-oil").innerHTML = TP.media(sample("o1"));
    }
    const art = TP.$("[data-winter-art]");
    if (art) art.innerHTML = TP.winterArt();

    const cats = TP.$("[data-categories]");
    if (cats) {
      // Bento layout: the three core categories get large tiles with product art
      const LAYOUT = { tyres: ["xl", "t2"], batteries: ["wide", "b4"], oils: ["wide", "o5"], rims: ["sm"], parts: ["sm"], services: ["wide-ink"] };
      cats.innerHTML = TP.data.categories.map((c) => {
        const [size, sample] = LAYOUT[c.id] || ["sm"];
        const n = c.id === "services" ? TP.data.services.length : TP.data.products.filter((p) => p.category === c.id).length;
        const meta = c.id === "services" ? `${n} xidmət · onlayn rezervasiya` : `${n} məhsul`;
        const art = sample ? `<span class="bento__media" aria-hidden="true">${TP.media(TP.data.byId(sample))}</span>` : "";
        return `<a class="bento__tile bento__tile--${size}" href="${c.href}">
          <span class="bento__text"><span class="bento__icon">${TP.icon(c.icon, 22)}</span><span class="bento__name">${esc(c.name)}</span><span class="bento__meta">${meta}</span></span>
          <span class="bento__go" aria-hidden="true">${TP.icon("arrow-right", 18)}</span>${art}
        </a>`;
      }).join("");
    }

    const popGrid = TP.$("[data-popular]");
    const popLink = TP.$("[data-popular-link]");
    const renderPopular = (cat) => {
      const inStock = TP.data.products.filter((p) => p.stock > 0 && (!cat || p.category === cat)).sort((a, b) => b.popularity - a.popularity);
      // "Hamısı" mixes the three main categories so tyres don't crowd out the rest
      const list = cat ? inStock.slice(0, 4) : ["tyres", "batteries", "oils", "tyres"].map((c, i) => inStock.filter((p) => p.category === c)[i === 3 ? 1 : 0]).filter(Boolean);
      TP.renderGrid(popGrid, list);
      if (popLink) popLink.href = cat ? `catalog.html?cat=${cat}&sort=popular` : "catalog.html?sort=popular";
    };
    const popTabs = TP.$("[data-popular-tabs]");
    if (popTabs) popTabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pop]");
      if (!b) return;
      TP.$$("[data-pop]", popTabs).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      renderPopular(b.dataset.pop);
    });
    renderPopular("");
    const sale = TP.data.products.filter((p) => p.oldPrice).sort((a, b) => TP.discount(b) - TP.discount(a)).slice(0, 4);
    TP.renderGrid(TP.$("[data-sale]"), sale);

    const brands = TP.$("[data-brands]");
    if (brands) {
      brands.innerHTML = TP.data.brands().slice(0, 12).map((b) => {
        const n = TP.data.products.filter((p) => p.brand === b).length;
        return `<a class="brand-tile" lang="en" href="catalog.html?brand=${encodeURIComponent(b)}"><span>${esc(b)}<small>${n} məhsul</small></span></a>`;
      }).join("");
    }

    const svc = TP.$("[data-service-tiles]");
    if (svc) {
      svc.innerHTML = TP.data.services.map((s) => `
        <a class="service-tile" href="booking.html?service=${encodeURIComponent(s.id)}">
          <span class="service-tile__icon">${TP.icon(s.icon, 22)}</span>
          <div><h3>${esc(s.name)}</h3><p>${esc(s.duration)} · demo müddət</p></div>
          ${TP.icon("arrow-right", 18)}
        </a>`).join("");
    }

    const blog = TP.$("[data-articles]");
    if (blog) {
      blog.innerHTML = TP.data.articles.map((a) => `
        <button type="button" class="article-card" data-article="${esc(a.id)}">
          <span class="article-card__cover">${TP.icon(a.icon, 80)}</span>
          <span class="article-card__body"><span class="article-card__title">${esc(a.title)}</span><span class="article-card__text">${esc(a.excerpt)}</span><span class="article-card__more">Oxu ${TP.icon("arrow-right", 16)}</span></span>
        </button>`).join("");
      blog.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-article]");
        if (!btn) return;
        const a = TP.data.articles.find((x) => x.id === btn.dataset.article);
        const html = a.body.map(([t, v]) => t === "ul" ? `<ul>${v.map((li) => `<li>${esc(li)}</li>`).join("")}</ul>` : `<p>${esc(v)}</p>`).join("");
        TP.modal({ title: a.title, content: `<div class="prose">${html}</div>`, wide: true });
      });
    }
  }

  TP.pages.home = () => { initFinder(); initSections(); };
})();
