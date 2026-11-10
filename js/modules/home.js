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
    const cats = TP.$("[data-categories]");
    if (cats) {
      // Category photography is intentionally separate from demo product artwork.
      const CATEGORY_PHOTOS = Object.fromEntries(
        ["tyres", "batteries", "oils", "rims", "parts", "brakes", "services"].map((c) =>
          [c, `assets/images/premium/categories/${c}.webp`])
      );
      // Bento layout: the three core categories get large tiles with product art
      const LAYOUT = { tyres: ["xl", "t2"], batteries: ["wide", "b4"], oils: ["wide", "o5"], rims: ["sm", "r1"], parts: ["sm", "p1"], brakes: ["sm", "p2"], services: ["sm-ink"] };
      cats.innerHTML = TP.data.categories.map((c) => {
        const [size, sample] = LAYOUT[c.id] || ["sm"];
        const n = c.id === "services" ? TP.data.services.length : TP.data.products.filter((p) => p.category === c.id).length;
        const meta = c.id === "services" ? `${n} xidmət · onlayn rezervasiya` : `${n} məhsul`;
        const art = `<span class="bento__media" aria-hidden="true"><img src="${CATEGORY_PHOTOS[c.id]}" alt="" loading="lazy" decoding="async"></span>`;
        return `<a class="bento__tile bento__tile--${size}" href="${c.href}">
          <span class="bento__text"><span class="bento__icon">${TP.icon(c.icon, 22)}</span><span class="bento__name">${esc(c.name)}</span><span class="bento__meta">${meta}</span></span>
          <span class="bento__go" aria-hidden="true">${TP.icon("arrow-right", 18)}</span>${art}
        </a>`;
      }).join("");
    }

    // Product tabs: discounted / best selling / new (as on the reference site)
    const ptabs = TP.$("[data-product-tabs]");
    if (ptabs) {
      const grid = TP.$("[data-ptab-grid]", ptabs);
      const all = TP.$("[data-ptab-all]", ptabs);
      const tabs = TP.$$("[data-ptab]", ptabs);
      // Interleave categories so tyres, batteries and oils all appear
      const mix = (list, n = 8) => {
        const by = {};
        list.forEach((p) => { (by[p.category] = by[p.category] || []).push(p); });
        const order = ["tyres", "batteries", "oils", "tyres", "brakes", "rims", "parts"];
        const out = [];
        while (out.length < n && Object.values(by).some((a) => a.length)) {
          order.forEach((c) => { if (out.length < n && by[c] && by[c].length) out.push(by[c].shift()); });
        }
        return out;
      };
      const SETS = {
        sale: { list: () => mix(TP.data.products.filter((p) => p.oldPrice).sort((a, b) => TP.discount(b) - TP.discount(a))), href: "catalog.html?sale=1" },
        best: { list: () => mix(TP.data.products.filter((p) => p.stock > 0).sort((a, b) => b.popularity - a.popularity)), href: "catalog.html?sort=popular" },
        new: { list: () => TP.data.products.slice().sort((a, b) => b.added - a.added).slice(0, 8), href: "catalog.html?sort=new" },
      };
      const show = (tab) => {
        tabs.forEach((t) => { const on = t === tab; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; });
        grid.setAttribute("aria-labelledby", tab.id);
        const set = SETS[tab.dataset.ptab];
        TP.renderGrid(grid, set.list());
        all.href = set.href;
      };
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => show(t));
        t.addEventListener("keydown", (e) => {
          if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
          const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
          show(n); n.focus();
        });
      });
      show(tabs[0]);
    }

    // Video cards (no third-party embeds in the prototype)
    const vids = TP.$("[data-videos]");
    if (vids) {
      vids.innerHTML = TP.data.videos.map((v) => `
        <button type="button" class="video-card" data-video="${esc(v.id)}">
          <span class="video-card__thumb"><img src="assets/images/premium/editorial/${({ v1: "video-tyres", v2: "video-season", v3: "video-service" })[v.id] || "size"}.webp" alt="" loading="lazy" decoding="async"><span class="video-card__play">${TP.icon("play", 22)}</span><span class="video-card__time mono">${esc(v.duration)}</span></span>
          <span class="video-card__title">${esc(v.title)}</span>
        </button>`).join("");
      const openVideo = (v) => TP.modal({ title: v ? v.title : "Video", content: `<div class="stack"><div class="video-placeholder">${TP.icon("youtube", 48)}<span>Video tezliklə əlavə olunacaq</span></div><div class="notice notice--demo">${TP.icon("info", 18)}<span>Prototipdə xarici video pleyerlər qoşulmayıb. Real video linkləri əlavə ediləndə burada açılacaq.</span></div></div>`, wide: true });
      vids.addEventListener("click", (e) => { const b = e.target.closest("[data-video]"); if (b) openVideo(TP.data.videos.find((x) => x.id === b.dataset.video)); });
      const allBtn = TP.$("[data-video-all]");
      if (allBtn) allBtn.addEventListener("click", () => openVideo(null));
    }

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
          <span class="article-card__cover"><img src="assets/images/premium/editorial/${a.id}.webp" alt="" loading="lazy" decoding="async"></span>
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

  /* Hero slider: autoplay (paused on hover/focus, hidden tab, reduced motion),
     prev/next, dots, swipe, pause button. The hero tone follows the slide. */
  function initSlider() {
    const root = TP.$("[data-slider]");
    if (!root) return;
    const hero = root.closest(".hero");
    const slides = TP.$$(".slide", root);
    const arts = TP.$$("[data-art-panel]");
    const dots = TP.$$("[data-slide-to]", root);
    const count = TP.$("[data-slide-count]", root);
    const pauseBtn = TP.$("[data-slide-pause]", root);
    const DELAY = 6500;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0, timer = null, userPaused = reduce, hover = false;

    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => {
        const on = k === i;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
        s.inert = !on;
      });
      arts.forEach((a) => a.classList.toggle("is-active", Number(a.dataset.artPanel) === Number(slides[i].dataset.art)));
      dots.forEach((d, k) => { if (k === i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current"); });
      if (count) count.textContent = `${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      if (hero) hero.dataset.tone = slides[i].dataset.tone;
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { stop(); if (!userPaused && !hover && !document.hidden) timer = setInterval(() => go(i + 1), DELAY); };

    TP.$("[data-slide-prev]", root).addEventListener("click", () => { go(i - 1); start(); });
    TP.$("[data-slide-next]", root).addEventListener("click", () => { go(i + 1); start(); });
    dots.forEach((d) => d.addEventListener("click", () => { go(Number(d.dataset.slideTo)); start(); }));
    pauseBtn.addEventListener("click", () => {
      userPaused = !userPaused;
      pauseBtn.setAttribute("aria-pressed", String(userPaused));
      pauseBtn.setAttribute("aria-label", userPaused ? "Avtomatik keçidi başlat" : "Avtomatik keçidi dayandır");
      pauseBtn.innerHTML = TP.icon(userPaused ? "play" : "minus", 16);
      start();
    });
    if (reduce) { pauseBtn.setAttribute("aria-pressed", "true"); pauseBtn.innerHTML = TP.icon("play", 16); pauseBtn.setAttribute("aria-label", "Avtomatik keçidi başlat"); }
    // Pause while the visitor is reading or using the finder
    [hero || root].forEach((el) => {
      el.addEventListener("mouseenter", () => { hover = true; stop(); });
      el.addEventListener("mouseleave", () => { hover = false; start(); });
      el.addEventListener("focusin", () => { hover = true; stop(); });
      el.addEventListener("focusout", (e) => { if (!el.contains(e.relatedTarget)) { hover = false; start(); } });
    });
    document.addEventListener("visibilitychange", start);
    // Swipe
    let x0 = null;
    const area = TP.$(".slider__slides", root);
    area.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    area.addEventListener("touchend", (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) { go(i + (dx < 0 ? 1 : -1)); start(); }
      x0 = null;
    });
    root.addEventListener("keydown", (e) => {
      if (e.target.closest(".slider__controls") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { go(i + (e.key === "ArrowRight" ? 1 : -1)); start(); }
    });
    go(0);
    start();
  }

  TP.pages.home = () => { initSlider(); initFinder(); initSections(); };
})();
