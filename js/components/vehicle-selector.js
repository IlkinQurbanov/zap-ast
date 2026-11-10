/* VehicleSelector + TireSizeSelector helpers */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  const opt = (v, label, sel) => `<option value="${esc(v)}" ${sel ? "selected" : ""}>${esc(label)}</option>`;

  TP.tyreSizeOptions = () => {
    const tyres = TP.data.products.filter((p) => p.category === "tyres");
    const uniq = (k) => Array.from(new Set(tyres.map((p) => p[k]))).sort((a, b) => a - b);
    return { widths: uniq("width"), profiles: uniq("profile"), diameters: uniq("diameter") };
  };

  /** Fill three <select>s (width/profile/diameter) with options. */
  TP.fillSizeSelects = ({ w, p, d }, preset = {}) => {
    const o = TP.tyreSizeOptions();
    if (w) w.innerHTML = opt("", "En") + o.widths.map((x) => opt(x, x, String(preset.w) === String(x))).join("");
    if (p) p.innerHTML = opt("", "Profil") + o.profiles.map((x) => opt(x, x, String(preset.p) === String(x))).join("");
    if (d) d.innerHTML = opt("", "Diametr") + o.diameters.map((x) => opt(x, "R" + x, String(preset.d) === String(x))).join("");
  };

  /**
   * Wire make → model → year selects. onChange(result|null),
   * result = { make, model, year, size:[w,p,d], label }
   */
  TP.vehicleSelector = ({ make, model, year }, onChange) => {
    const V = TP.data.vehicles;
    make.innerHTML = opt("", "Marka") + Object.keys(V).map((m) => opt(m, m)).join("");
    model.innerHTML = opt("", "Model");
    year.innerHTML = opt("", "İl");
    model.disabled = true;
    year.disabled = true;

    const emit = () => {
      const mk = make.value, md = model.value, yr = year.value;
      if (mk && md && yr) {
        const entry = V[mk][md];
        onChange({ make: mk, model: md, year: Number(yr), size: entry.size, battery: entry.battery, oil: entry.oil, label: `${mk} ${md} ${yr}` });
      } else onChange(null);
    };

    make.addEventListener("change", () => {
      const models = make.value ? Object.keys(V[make.value]) : [];
      model.innerHTML = opt("", "Model") + models.map((m) => opt(m, m)).join("");
      model.disabled = !models.length;
      year.innerHTML = opt("", "İl");
      year.disabled = true;
      emit();
    });
    model.addEventListener("change", () => {
      const e = make.value && model.value ? V[make.value][model.value] : null;
      let years = "";
      if (e) for (let y = e.years[1]; y >= e.years[0]; y--) years += opt(y, y);
      year.innerHTML = opt("", "İl") + years;
      year.disabled = !e;
      emit();
    });
    year.addEventListener("change", emit);
  };

  /** What a vehicle needs per category, with catalog links (demo table). */
  TP.vehicleNeeds = (res) => {
    const car = encodeURIComponent(res.label);
    return {
      tyres: { label: "Təkər ölçüsü", value: TP.sizeText(res.size), match: (p) => TP.matchesSize(p, res.size),
        href: `catalog.html?cat=tyres&w=${res.size[0]}&p=${res.size[1]}&d=${res.size[2]}&car=${car}` },
      batteries: { label: "Akkumulyator", value: `${res.battery} Ah`, match: (p) => p.category === "batteries" && p.capacity === res.battery,
        href: `catalog.html?cat=batteries&ah=${res.battery}&car=${car}` },
      oils: { label: "Mühərrik yağı", value: res.oil, match: (p) => p.category === "oils" && p.viscosity === res.oil,
        href: `catalog.html?cat=oils&visc=${encodeURIComponent(res.oil)}&car=${car}` },
    };
  };

  TP.sizeText = (s) => `${s[0]}/${s[1]} R${s[2]}`;
  TP.matchesSize = (p, s) => p.category === "tyres" && p.width === s[0] && p.profile === s[1] && p.diameter === s[2];
})();
