/* Catalog: filters (sidebar / mobile drawer), sort, search, chips, load more. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;
  const PAGE_SIZE = 9;
  const LIST_KEYS = ["brand", "w", "p", "d", "season", "fuel", "wet", "ah", "tech", "visc", "vol", "otype"];
  // Category-specific filters, reset when the category changes
  const CAT_KEYS = ["w", "p", "d", "season", "fuel", "wet", "rf", "noise", "ah", "tech", "visc", "vol", "otype"];

  const SORTS = {
    rec: { label: "Tövsiyə olunan", fn: (a, b) => (b.stock > 0) - (a.stock > 0) || b.popularity - a.popularity },
    cheap: { label: "Əvvəlcə ucuz", fn: (a, b) => a.price - b.price },
    expensive: { label: "Əvvəlcə bahalı", fn: (a, b) => b.price - a.price },
    popular: { label: "Ən populyar", fn: (a, b) => b.popularity - a.popularity },
    new: { label: "Ən yeni", fn: (a, b) => b.added - a.added },
  };

  let state, shown = PAGE_SIZE, els = {};

  function readState() {
    const q = TP.params();
    const s = { cat: q.get("cat") || "", q: q.get("q") || "", fav: q.get("fav") === "1", car: q.get("car") || "",
      min: q.get("min") || "", max: q.get("max") || "", stock: q.get("stock") === "1", rf: q.get("rf") === "1",
      noise: q.get("noise") || "", sort: SORTS[q.get("sort")] ? q.get("sort") : "rec" };
    LIST_KEYS.forEach((k) => { s[k] = (q.get(k) || "").split(",").filter(Boolean); });
    if (!TP.data.categories.some((c) => c.id === s.cat && c.id !== "services")) s.cat = "";
    // A typed tyre size in search becomes structured filters
    const size = s.q ? TP.parseSize(s.q) : null;
    if (size) {
      s.cat = "tyres"; s.w = [String(size.width)]; s.p = [String(size.profile)];
      if (size.diameter) s.d = [String(size.diameter)];
      s.q = "";
    }
    return s;
  }

  function writeState() {
    const q = new URLSearchParams();
    ["cat", "q", "car", "min", "max", "noise"].forEach((k) => { if (state[k]) q.set(k, state[k]); });
    if (state.sort !== "rec") q.set("sort", state.sort);
    ["fav", "stock", "rf"].forEach((k) => { if (state[k]) q.set(k, "1"); });
    LIST_KEYS.forEach((k) => { if (state[k].length) q.set(k, state[k].join(",")); });
    const str = q.toString();
    try { window.history.replaceState(null, "", str ? `?${str}` : window.location.pathname); } catch (e) { /* sandboxed */ }
  }

  const inList = (arr, v) => !arr.length || arr.includes(String(v));

  function filtered(ignore) {
    let list = TP.data.products.slice();
    if (state.fav) list = list.filter((p) => TP.fav.has(p.id));
    if (state.cat) list = list.filter((p) => p.category === state.cat);
    if (state.q) list = TP.searchProducts(state.q, list);
    if (ignore !== "brand") list = list.filter((p) => inList(state.brand, p.brand));
    const min = Number(state.min), max = Number(state.max);
    if (state.min && !Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    if (state.max && !Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    if (state.stock) list = list.filter((p) => p.stock > 0);
    if (state.cat === "tyres") {
      list = list.filter((p) => inList(state.w, p.width) && inList(state.p, p.profile) && inList(state.d, p.diameter)
        && inList(state.season, p.season) && inList(state.fuel, p.fuel) && inList(state.wet, p.wet)
        && (!state.rf || p.runflat) && (!state.noise || p.noise <= Number(state.noise)));
    }
    if (state.cat === "batteries") {
      list = list.filter((p) => inList(state.ah, p.capacity) && inList(state.tech, p.tech));
    }
    if (state.cat === "oils") {
      list = list.filter((p) => inList(state.visc, p.viscosity) && inList(state.vol, p.volume) && inList(state.otype, p.oilType));
    }
    return list;
  }

  /* ---------- Filter panel ---------- */
  function chipGroup(key, values, labelFn = (v) => v) {
    return values.map((v) => `<button type="button" class="chip" data-toggle="${key}" data-value="${esc(v)}" aria-pressed="${state[key].includes(String(v))}">${esc(labelFn(v))}</button>`).join("");
  }
  function group(title, body, { open = true, chips = false } = {}) {
    return `<details class="fgroup" ${open ? "open" : ""}><summary>${esc(title)}${TP.icon("chevron-down", 18)}</summary><div class="fgroup__body ${chips ? "fgroup__body--chips" : ""}">${body}</div></details>`;
  }

  function renderFilters() {
    const scope = TP.data.products.filter((p) => !state.cat || p.category === state.cat);
    const brandBase = filtered("brand");
    const brands = Array.from(new Set(scope.map((p) => p.brand)));
    let html = "";
    if (state.cat === "tyres") {
      const o = TP.tyreSizeOptions();
      html += group("En (mm)", chipGroup("w", o.widths), { chips: true });
      html += group("Profil (%)", chipGroup("p", o.profiles), { chips: true });
      html += group("Diametr", chipGroup("d", o.diameters, (v) => "R" + v), { chips: true });
      html += group("Mövsüm", ["summer", "winter", "all"].map((s) => `<label class="check"><input type="checkbox" data-toggle="season" value="${s}" ${state.season.includes(s) ? "checked" : ""}>${esc(TP.data.SEASON[s].label)}<span class="check__count">${scope.filter((p) => p.season === s).length}</span></label>`).join(""));
    }
    const uniq = (k) => Array.from(new Set(scope.map((p) => p[k]))).sort((a, b) => (typeof a === "number" ? a - b : String(a).localeCompare(String(b))));
    const checks = (key, values, field) => values.map((v) => `<label class="check"><input type="checkbox" data-toggle="${key}" value="${esc(v)}" ${state[key].includes(String(v)) ? "checked" : ""}>${esc(v)}<span class="check__count">${scope.filter((p) => String(p[field]) === String(v)).length}</span></label>`).join("");
    if (state.cat === "batteries") {
      html += group("Tutum (Ah)", chipGroup("ah", uniq("capacity"), (v) => v + " Ah"), { chips: true });
      html += group("Texnologiya", checks("tech", ["Standart", "EFB", "AGM"].filter((t) => scope.some((p) => p.tech === t)), "tech"));
    }
    if (state.cat === "oils") {
      html += group("Özlülük (SAE)", chipGroup("visc", uniq("viscosity")), { chips: true });
      html += group("Həcm", chipGroup("vol", uniq("volume"), (v) => v + " L"), { chips: true });
      html += group("Növ", checks("otype", uniq("oilType"), "oilType"));
    }
    html += group("Brend", brands.map((b) => `<label class="check"><input type="checkbox" data-toggle="brand" value="${esc(b)}" ${state.brand.includes(b) ? "checked" : ""}>${esc(b)}<span class="check__count">${brandBase.filter((p) => p.brand === b).length}</span></label>`).join(""));
    html += group("Qiymət, ₼", `<div class="price-range">
        <label class="sr-only" for="f-min">Minimum qiymət</label><input class="input tabular" id="f-min" type="number" inputmode="numeric" min="0" placeholder="${Math.floor(Math.min(...scope.map((p) => p.price)))}" value="${esc(state.min)}" data-price="min">
        <span class="muted">—</span>
        <label class="sr-only" for="f-max">Maksimum qiymət</label><input class="input tabular" id="f-max" type="number" inputmode="numeric" min="0" placeholder="${Math.ceil(Math.max(...scope.map((p) => p.price)))}" value="${esc(state.max)}" data-price="max">
      </div>`);
    html += group("Mövcudluq", `<label class="check"><input type="checkbox" data-flag="stock" ${state.stock ? "checked" : ""}>Yalnız stokda olanlar</label>`
      + (state.cat === "tyres" ? `<label class="check"><input type="checkbox" data-flag="rf" ${state.rf ? "checked" : ""}>Run-flat</label>` : ""));
    if (state.cat === "tyres") {
      html += group("Yanacaq səmərəliliyi", chipGroup("fuel", ["A", "B", "C", "D"]), { chips: true, open: false });
      html += group("Yaş yolda tutuş", chipGroup("wet", ["A", "B", "C"]), { chips: true, open: false });
      html += group("Səs səviyyəsi", [["", "Fərqi yoxdur"], ["69", "69 dB-ə qədər"], ["71", "71 dB-ə qədər"]].map(([v, l]) =>
        `<label class="check"><input type="radio" name="f-noise" data-noise value="${v}" ${state.noise === v ? "checked" : ""}>${l}</label>`).join(""), { open: false });
    }
    if (!state.cat) {
      html = group("Kateqoriya", TP.data.categories.filter((c) => c.id !== "services").map((c) => `<label class="check"><input type="radio" name="f-cat" data-cat value="${c.id}">${esc(c.name)}<span class="check__count">${TP.data.products.filter((p) => p.category === c.id && (!state.fav || TP.fav.has(p.id))).length}</span></label>`).join("")) + html;
    }
    els.filterBody.innerHTML = html;
  }

  /* ---------- Results ---------- */
  function chipsMarkup() {
    const chips = [];
    const add = (label, key, value) => chips.push(`<button type="button" class="chip chip--remove" data-remove="${key}" data-value="${esc(value || "")}">${esc(label)}${TP.icon("close", 14)}<span class="sr-only">filtri sil</span></button>`);
    if (state.q) add(`"${state.q}"`, "q");
    if (state.car) add(state.car, "car");
    state.w.forEach((v) => add(`En ${v}`, "w", v));
    state.p.forEach((v) => add(`Profil ${v}`, "p", v));
    state.d.forEach((v) => add(`R${v}`, "d", v));
    state.season.forEach((v) => add(TP.data.SEASON[v] ? TP.data.SEASON[v].label : v, "season", v));
    state.brand.forEach((v) => add(v, "brand", v));
    state.fuel.forEach((v) => add(`Yanacaq ${v}`, "fuel", v));
    state.ah.forEach((v) => add(`${v} Ah`, "ah", v));
    state.tech.forEach((v) => add(v, "tech", v));
    state.visc.forEach((v) => add(v, "visc", v));
    state.vol.forEach((v) => add(`${v} L`, "vol", v));
    state.otype.forEach((v) => add(v, "otype", v));
    state.wet.forEach((v) => add(`Yaş yol ${v}`, "wet", v));
    if (state.min) add(`${state.min} ₼-dan`, "min");
    if (state.max) add(`${state.max} ₼-dək`, "max");
    if (state.stock) add("Stokda var", "stock");
    if (state.rf) add("Run-flat", "rf");
    if (state.noise) add(`≤ ${state.noise} dB`, "noise");
    if (chips.length > 1) chips.push('<button type="button" class="btn btn--ghost btn--sm" data-clear>Hamısını təmizlə</button>');
    return chips.join("");
  }

  function titleText() {
    if (state.fav) return "Favoritlər";
    if (state.car) return `${state.car} üçün ${(state.cat ? TP.data.catName(state.cat) : "məhsullar").toLocaleLowerCase("az")}`;
    if (state.q) return `"${state.q}" üzrə axtarış`;
    return state.cat ? TP.data.catName(state.cat) : "Bütün məhsullar";
  }

  function render({ keepPage = false } = {}) {
    if (!keepPage) shown = PAGE_SIZE;
    const list = filtered().sort(SORTS[state.sort].fn);
    const title = titleText();
    els.title.textContent = title;
    document.title = `${title} — Zapçast.az`;
    els.crumb.textContent = title;
    els.count.textContent = `${list.length} məhsul`;
    els.chips.innerHTML = chipsMarkup();
    els.sort.value = state.sort;
    TP.$$("[data-cat-tab]", els.tabs).forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.catTab === state.cat)));
    TP.$$("[data-apply-count]").forEach((b) => { b.textContent = `${list.length} nəticəni göstər`; });

    if (!list.length) {
      els.grid.innerHTML = "";
      els.more.hidden = true;
      els.empty.hidden = false;
      els.empty.querySelector("h2").textContent = state.fav && !TP.fav.count() ? "Hələ favorit məhsul yoxdur" : "Uyğun məhsul tapılmadı";
      els.empty.querySelector("p").textContent = state.fav && !TP.fav.count()
        ? "Məhsul kartındakı ürək ikonuna basaraq bəyəndiyiniz məhsulları burada saxlayın."
        : "Filtrləri azaldın və ya ölçünü 205/55 R16 formatında yenidən yoxlayın.";
    } else {
      els.empty.hidden = true;
      TP.renderGrid(els.grid, list.slice(0, shown));
      const rest = list.length - shown;
      els.more.hidden = rest <= 0;
      els.moreMeta.textContent = `${Math.min(shown, list.length)} / ${list.length} məhsul göstərilir`;
      els.moreBar.style.width = `${Math.min(100, (shown / list.length) * 100)}%`;
    }
    writeState();
  }

  function refresh() { renderFilters(); render(); }

  /* ---------- Events ---------- */
  function wire() {
    els.tabs.innerHTML = `<button type="button" class="chip" data-cat-tab="">Hamısı</button>` +
      TP.data.categories.filter((c) => c.id !== "services").map((c) => `<button type="button" class="chip" data-cat-tab="${c.id}">${TP.icon(c.icon, 16)}${esc(c.name)}</button>`).join("");
    els.tabs.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat-tab]");
      if (!b) return;
      setCategory(b.dataset.catTab);
    });

    els.sort.innerHTML = Object.entries(SORTS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join("");
    els.sort.addEventListener("change", () => { state.sort = els.sort.value; render(); });

    els.filters.addEventListener("click", (e) => {
      const chip = e.target.closest("button[data-toggle]");
      if (chip) {
        const k = chip.dataset.toggle, v = chip.dataset.value;
        state[k] = state[k].includes(v) ? state[k].filter((x) => x !== v) : [...state[k], v];
        chip.setAttribute("aria-pressed", String(state[k].includes(v)));
        render();
      }
    });
    els.filters.addEventListener("change", (e) => {
      const t = e.target;
      if (t.matches("input[type=checkbox][data-toggle]")) {
        const k = t.dataset.toggle;
        state[k] = t.checked ? [...state[k], t.value] : state[k].filter((x) => x !== t.value);
        render();
      } else if (t.matches("[data-flag]")) { state[t.dataset.flag] = t.checked; render(); }
      else if (t.matches("[data-noise]")) { state.noise = t.value; render(); }
      else if (t.matches("[data-cat]")) { setCategory(t.value); }
      else if (t.matches("[data-price]")) { state[t.dataset.price] = t.value.trim(); render(); }
    });
    els.filters.addEventListener("input", TP.debounce((e) => {
      if (e.target.matches("[data-price]")) { state[e.target.dataset.price] = e.target.value.trim(); render(); }
    }, 450));

    document.addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]");
      if (rm && els.chips.contains(rm)) {
        const k = rm.dataset.remove, v = rm.dataset.value;
        if (LIST_KEYS.includes(k)) state[k] = state[k].filter((x) => x !== v);
        else if (typeof state[k] === "boolean") state[k] = false;
        else state[k] = "";
        refresh();
      }
      if (e.target.closest("[data-clear]")) clearAll();
    });

    els.moreBtn.addEventListener("click", () => {
      const firstNew = shown;
      shown += PAGE_SIZE;
      render({ keepPage: true });
      const card = els.grid.children[firstNew];
      if (card) { const link = card.querySelector(".pcard__title a"); if (link) link.focus({ preventScroll: true }); }
    });

    // Mobile filter drawer
    const overlay = TP.$("[data-filters-overlay]");
    const openBtn = TP.$("[data-open-filters]");
    const layerRoot = els.filters;
    const layer = TP.layer(layerRoot, layerRoot, { onClose: () => { layerRoot.classList.remove("is-open"); overlay.hidden = true; layerRoot.hidden = false; openBtn.setAttribute("aria-expanded", "false"); } });
    // The panel is always in the DOM on desktop; the layer only drives focus/esc on mobile.
    layerRoot.hidden = false;
    openBtn.addEventListener("click", () => {
      layerRoot.hidden = true; // let layer.open() toggle it back
      layer.open(openBtn);
      layerRoot.classList.add("is-open");
      layerRoot.setAttribute("role", "dialog");
      layerRoot.setAttribute("aria-modal", "true");
      overlay.hidden = false;
      openBtn.setAttribute("aria-expanded", "true");
    });
    overlay.addEventListener("click", () => layer.close());
    TP.$$("[data-close-filters]").forEach((b) => b.addEventListener("click", () => layer.close()));
    window.addEventListener("resize", TP.debounce(() => {
      if (window.innerWidth >= 1024 && layerRoot.classList.contains("is-open")) layer.close();
      if (window.innerWidth >= 1024) { layerRoot.removeAttribute("role"); layerRoot.removeAttribute("aria-modal"); }
    }, 150));

    TP.on("tp:fav", () => { if (state.fav) render({ keepPage: true }); });
  }

  function setCategory(cat) {
    state.cat = cat;
    CAT_KEYS.forEach((k) => { state[k] = LIST_KEYS.includes(k) ? [] : (typeof state[k] === "boolean" ? false : ""); });
    state.brand = [];
    state.car = "";
    refresh();
  }

  function clearAll() {
    const keep = { cat: state.cat, sort: state.sort, fav: state.fav };
    state = Object.assign(readStateEmpty(), keep);
    const input = TP.$("#site-search");
    if (input) input.value = "";
    refresh();
  }
  function readStateEmpty() {
    const s = { cat: "", q: "", fav: false, car: "", min: "", max: "", stock: false, rf: false, noise: "", sort: "rec" };
    LIST_KEYS.forEach((k) => { s[k] = []; });
    return s;
  }

  TP.pages.catalog = () => {
    els = {
      title: TP.$("[data-cat-title]"), crumb: TP.$("[data-crumb-current]"), count: TP.$("[data-cat-count]"),
      tabs: TP.$("[data-cat-tabs]"), chips: TP.$("[data-active-chips]"), sort: TP.$("#sort"),
      filters: TP.$("#filters"), filterBody: TP.$("[data-filter-body]"), grid: TP.$("[data-catalog-grid]"),
      empty: TP.$("[data-catalog-empty]"), more: TP.$("[data-load-more]"), moreBtn: TP.$("[data-load-more] button"),
      moreMeta: TP.$("[data-more-meta]"), moreBar: TP.$("[data-more-bar]"),
    };
    if (!els.grid) return;
    state = readState();
    wire();
    refresh();
  };
})();
