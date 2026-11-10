/* Product imagery — generated SVG so every view of a product stays
   consistent with its own data (size code, season tread, EU label).
   Replace with real product photos when assets are available. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;
  const MONO = "IBM Plex Mono, ui-monospace, Menlo, monospace";
  const DISPLAY = "Archivo, Arial, sans-serif";

  const svg = (label, inner, vb = "0 0 400 400") =>
    `<svg viewBox="${vb}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;

  const FINISH = {
    silver: ["#F4F7FA", "#BAC4CE", "#E3E9EF", "#8E9AA6"],
    graphite: ["#7C8792", "#3E474F", "#68737D", "#2A3036"],
  };

  function rimGroup(id, cx, cy, r, finish = "silver") {
    const f = FINISH[finish] || FINISH.silver;
    let spokes = "";
    for (let i = 0; i < 5; i++) {
      const a = i * 72;
      spokes += `<path transform="rotate(${a} ${cx} ${cy})" d="M ${cx - r * 0.07} ${cy - r * 0.2} L ${cx - r * 0.17} ${cy - r * 0.9} Q ${cx} ${cy - r * 0.95} ${cx + r * 0.17} ${cy - r * 0.9} L ${cx + r * 0.07} ${cy - r * 0.2} Z" fill="url(#${id}r)" stroke="${f[3]}" stroke-width="1"/>`;
    }
    let nuts = "";
    for (let i = 0; i < 5; i++) {
      const a = ((i * 72 + 36) * Math.PI) / 180;
      nuts += `<circle cx="${(cx + Math.sin(a) * r * 0.14).toFixed(1)}" cy="${(cy - Math.cos(a) * r * 0.14).toFixed(1)}" r="${(r * 0.028).toFixed(1)}" fill="#59636D"/>`;
    }
    return `
      <defs><linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${f[0]}"/><stop offset=".45" stop-color="${f[1]}"/><stop offset=".7" stop-color="${f[2]}"/><stop offset="1" stop-color="${f[3]}"/>
      </linearGradient></defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}r)"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="#20272E"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="none" stroke="#0E1216" stroke-width="${r * 0.04}" opacity=".6"/>
      ${spokes}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.24}" fill="url(#${id}r)" stroke="${f[3]}" stroke-width="1.2"/>
      ${nuts}
      <circle cx="${cx}" cy="${cy}" r="${r * 0.085}" fill="#0E1726"/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.085}" fill="none" stroke="#FF5A1F" stroke-width="1.5"/>`;
  }

  function tyreFront(p, id, opts = {}) {
    const cx = 200, cy = 200;
    let lugs = "";
    for (let i = 0; i < 60; i++) {
      lugs += `<rect x="194" y="13" width="12" height="22" rx="2.5" fill="#2A3137" transform="rotate(${i * 6} ${cx} ${cy})"/>`;
    }
    const brandLine = `${p.brand} · ${p.model}`.toUpperCase();
    const sizeLine = p.size ? `${p.size} ${p.load}${p.speed}` : "205/55 R16 91V";
    return `
      <defs>
        <radialGradient id="${id}s" cx="50%" cy="46%" r="56%">
          <stop offset="0" stop-color="#424B54"/><stop offset=".72" stop-color="#20262B"/><stop offset="1" stop-color="#121518"/>
        </radialGradient>
        <path id="${id}t" d="M 64 200 A 136 136 0 0 1 336 200"/>
        <path id="${id}b" d="M 50 200 A 150 150 0 0 0 350 200"/>
      </defs>
      ${opts.shadow === false ? "" : '<ellipse cx="200" cy="390" rx="140" ry="8" fill="#000" opacity=".16"/>'}
      <circle cx="${cx}" cy="${cy}" r="187" fill="#171B1F"/>
      ${lugs}
      <circle cx="${cx}" cy="${cy}" r="170" fill="url(#${id}s)"/>
      <circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="#FFFFFF" stroke-opacity=".06" stroke-width="1.5"/>
      <circle cx="${cx}" cy="${cy}" r="122" fill="none" stroke="#FFFFFF" stroke-opacity=".07" stroke-width="1.5"/>
      <text font-family="${MONO}" font-size="15" font-weight="600" letter-spacing="3" fill="#A3AEB9"><textPath href="#${id}t" startOffset="50%" text-anchor="middle">${esc(brandLine)}</textPath></text>
      <text font-family="${MONO}" font-size="19" font-weight="600" letter-spacing="2" fill="#D3DBE2"><textPath href="#${id}b" startOffset="50%" text-anchor="middle">${esc(sizeLine)}</textPath></text>
      ${rimGroup(id, cx, cy, 112, opts.finish || "silver")}
      <path d="M 52 150 A 160 160 0 0 1 150 44" fill="none" stroke="#FFFFFF" stroke-opacity=".08" stroke-width="10" stroke-linecap="round"/>`;
  }

  function tyreTread(p, id) {
    const x = 120, w = 160, y = 18, h = 364;
    let pattern = "";
    if (p.season === "summer") {
      [158, 184, 216, 242].forEach((gx) => { pattern += `<rect x="${gx - 4}" y="${y}" width="8" height="${h}" fill="#0A0C0E"/>`; });
      for (let yy = y; yy < y + h; yy += 22) {
        pattern += `<path d="M ${x} ${yy} l 30 10 M ${x + w} ${yy + 11} l -30 -10 M 190 ${yy + 4} l 20 8" stroke="#0A0C0E" stroke-width="4"/>`;
      }
    } else if (p.season === "winter") {
      [166, 200, 234].forEach((gx) => {
        let d = `M ${gx} ${y}`;
        for (let yy = y; yy < y + h; yy += 24) d += ` L ${gx + 6} ${yy + 12} L ${gx} ${yy + 24}`;
        pattern += `<path d="${d}" fill="none" stroke="#0A0C0E" stroke-width="6"/>`;
      });
      for (let yy = y + 8; yy < y + h; yy += 13) {
        pattern += `<path d="M ${x + 6} ${yy} l 8 -3 l 8 3 l 8 -3 l 8 3 M ${172} ${yy + 4} l 6 -3 l 6 3 l 6 -3 l 6 3 M ${206} ${yy} l 6 -3 l 6 3 l 6 -3 l 6 3 M ${240} ${yy + 4} l 8 -3 l 8 3 l 8 -3 l 8 3" fill="none" stroke="#0A0C0E" stroke-width="1.6"/>`;
      }
    } else {
      for (let yy = y - 20; yy < y + h; yy += 30) {
        pattern += `<path d="M ${x - 4} ${yy} L 200 ${yy + 26} L ${x + w + 4} ${yy}" fill="none" stroke="#0A0C0E" stroke-width="7"/>`;
      }
      pattern += `<rect x="196" y="${y}" width="8" height="${h}" fill="#0A0C0E"/>`;
      for (let yy = y + 10; yy < y + h; yy += 30) {
        pattern += `<path d="M ${x + 18} ${yy + 6} l 14 4 M ${x + w - 18} ${yy + 6} l -14 4" stroke="#0A0C0E" stroke-width="1.6"/>`;
      }
    }
    return `
      <defs><clipPath id="${id}c"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="34"/></clipPath>
      <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#14171A"/><stop offset=".18" stop-color="#2B3238"/><stop offset=".82" stop-color="#2B3238"/><stop offset="1" stop-color="#14171A"/></linearGradient></defs>
      <rect x="${x - 26}" y="${y + 6}" width="${w + 52}" height="${h - 12}" rx="40" fill="#1A1E22"/>
      <g clip-path="url(#${id}c)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id}g)"/>${pattern}</g>`;
  }

  const EU = { A: "#00A651", B: "#9ACA3C", C: "#FFF200", D: "#FDB913", E: "#ED1C24" };
  const EU_DARK_TEXT = { C: true, D: true };

  function euScale(x, y, active) {
    let out = "";
    "ABCDE".split("").forEach((L, i) => {
      const yy = y + i * 28, bw = 34 + i * 9;
      out += `<path d="M ${x} ${yy} h ${bw} l 9 10 l -9 10 h -${bw} Z" fill="${EU[L]}"/>`;
      out += `<text x="${x + 7}" y="${yy + 15}" font-family="${DISPLAY}" font-weight="800" font-size="13" fill="${EU_DARK_TEXT[L] ? "#1A1A1A" : "#FFFFFF"}">${L}</text>`;
      if (L === active) {
        out += `<path d="M ${x + 118} ${yy - 3} h -26 l -11 13 l 11 13 h 26 Z" fill="#111"/>`;
        out += `<text x="${x + 102}" y="${yy + 16}" text-anchor="middle" font-family="${DISPLAY}" font-weight="800" font-size="17" fill="#FFF">${L}</text>`;
      }
    });
    return out;
  }

  function euLabel(p) {
    const nClass = p.noise <= 68 ? "A" : p.noise <= 71 ? "B" : "C";
    const waves = nClass === "A" ? 1 : nClass === "B" ? 2 : 3;
    let w = "";
    for (let i = 0; i < 3; i++) {
      w += `<path d="M ${150 + i * 13} 300 a ${14 + i * 12} ${14 + i * 12} 0 0 1 0 34" fill="none" stroke="${i < waves ? "#111" : "#C8CED4"}" stroke-width="5" stroke-linecap="round" transform="translate(0 -17)"/>`;
    }
    return `
      <rect x="66" y="22" width="268" height="356" rx="14" fill="#FFFFFF" stroke="#D3DAE1" stroke-width="2"/>
      <rect x="66" y="22" width="268" height="44" rx="14" fill="#1D4F91"/>
      <rect x="66" y="50" width="268" height="16" fill="#1D4F91"/>
      <text x="200" y="50" text-anchor="middle" font-family="${DISPLAY}" font-weight="800" font-size="14" letter-spacing="2" fill="#FFFFFF">EU TƏKƏR ETİKETİ</text>
      <text x="86" y="92" font-family="${DISPLAY}" font-weight="700" font-size="12" fill="#3B4650">YANACAQ</text>
      <text x="210" y="92" font-family="${DISPLAY}" font-weight="700" font-size="12" fill="#3B4650">YAŞ YOL</text>
      ${euScale(86, 104, p.fuel)}
      ${euScale(210, 104, p.wet)}
      <line x1="86" y1="256" x2="314" y2="256" stroke="#E1E6EB" stroke-width="2"/>
      <path d="M 104 292 h 14 l 18 -14 v 46 l -18 -14 h -14 Z" fill="#111"/>
      ${w}
      <text x="214" y="312" font-family="${MONO}" font-weight="600" font-size="34" fill="#111">${esc(p.noise)}<tspan font-size="18"> dB</tspan></text>
      <text x="86" y="358" font-family="${DISPLAY}" font-weight="700" font-size="12" fill="#3B4650">XARİCİ SƏS · SİNİF ${nClass}</text>
      <text x="314" y="358" text-anchor="end" font-family="${MONO}" font-size="11" fill="#7A8591">${esc(p.size)}</text>`;
  }

  function battery(p) {
    return `
      <ellipse cx="200" cy="352" rx="150" ry="8" fill="#000" opacity=".15"/>
      <rect x="66" y="132" width="268" height="214" rx="12" fill="#26313C"/>
      <rect x="58" y="108" width="284" height="40" rx="9" fill="#18212A"/>
      <rect x="98" y="84" width="34" height="28" rx="4" fill="#B8433A"/><ellipse cx="115" cy="84" rx="17" ry="5" fill="#D25C51"/>
      <rect x="268" y="84" width="34" height="28" rx="4" fill="#4A535C"/><ellipse cx="285" cy="84" rx="17" ry="5" fill="#6A747E"/>
      <text x="115" y="136" text-anchor="middle" font-family="${DISPLAY}" font-weight="800" font-size="20" fill="#D25C51">+</text>
      <text x="285" y="136" text-anchor="middle" font-family="${DISPLAY}" font-weight="800" font-size="20" fill="#AEB8C2">−</text>
      <rect x="90" y="166" width="220" height="152" rx="8" fill="#F2F5F8"/>
      <rect x="90" y="166" width="220" height="10" rx="4" fill="#FF5A1F"/>
      <text x="110" y="206" font-family="${DISPLAY}" font-weight="800" font-size="18" letter-spacing="2" fill="#0E1726">${esc(p.brand.toUpperCase())}</text>
      <text x="110" y="262" font-family="${MONO}" font-weight="600" font-size="46" fill="#0E1726">${esc(p.capacity)}<tspan font-size="22">Ah</tspan></text>
      <text x="110" y="296" font-family="${MONO}" font-size="13" fill="#4A5763">${esc(p.voltage)}V · ${esc(p.cca)}A EN · ${esc(p.tech)}</text>`;
  }

  function oil(p) {
    return `
      <ellipse cx="200" cy="372" rx="120" ry="8" fill="#000" opacity=".15"/>
      <rect x="132" y="70" width="46" height="34" rx="5" fill="#FF5A1F"/>
      <path d="M 116 100 H 236 L 286 150 V 352 A 14 14 0 0 1 272 366 H 128 A 14 14 0 0 1 114 352 V 114 A 14 14 0 0 1 128 100 Z" fill="#16233A"/>
      <path d="M 240 106 L 280 146 V 214 H 252 V 150 Z" fill="#101A2C"/>
      <rect x="132" y="176" width="140" height="160" rx="8" fill="#F2F5F8"/>
      <text x="148" y="206" font-family="${DISPLAY}" font-weight="800" font-size="16" letter-spacing="2" fill="#0E1726">${esc(p.brand.toUpperCase())}</text>
      <text x="148" y="258" font-family="${MONO}" font-weight="600" font-size="34" fill="#0E1726">${esc(p.viscosity)}</text>
      <text x="148" y="284" font-family="${DISPLAY}" font-weight="600" font-size="13" fill="#4A5763">${esc(p.oilType)}</text>
      <rect x="148" y="300" width="50" height="22" rx="4" fill="#FF5A1F"/>
      <text x="173" y="316" text-anchor="middle" font-family="${MONO}" font-weight="600" font-size="13" fill="#0E1726">${esc(p.volume)} L</text>`;
  }

  function part(p) {
    if (p.partType === "pads") {
      const pad = (dx, dy, rot) => `
        <g transform="translate(${dx} ${dy}) rotate(${rot} 130 90)">
          <path d="M 20 60 Q 130 0 240 60 L 240 120 Q 130 80 20 120 Z" fill="#8C97A2"/>
          <path d="M 40 70 Q 130 26 220 70 L 220 112 Q 130 78 40 112 Z" fill="#2B3036"/>
          <circle cx="32" cy="92" r="7" fill="#5B6670"/><circle cx="228" cy="92" r="7" fill="#5B6670"/>
        </g>`;
      return `<ellipse cx="200" cy="350" rx="140" ry="8" fill="#000" opacity=".14"/>${pad(70, 70, -6)}${pad(70, 170, 4)}
        <text x="200" y="352" text-anchor="middle" font-family="${MONO}" font-size="14" font-weight="600" fill="#5B6670" opacity=".9">${esc(p.sku)}</text>`;
    }
    let ribs = "";
    for (let i = 0; i < 9; i++) ribs += `<rect x="${146 + i * 13}" y="262" width="6" height="56" rx="3" fill="#101A2C"/>`;
    return `
      <ellipse cx="200" cy="352" rx="110" ry="8" fill="#000" opacity=".15"/>
      <ellipse cx="200" cy="96" rx="78" ry="16" fill="#8C97A2"/>
      <rect x="122" y="96" width="156" height="240" rx="16" fill="#16233A"/>
      <rect x="122" y="150" width="156" height="92" fill="#FF5A1F"/>
      <text x="200" y="188" text-anchor="middle" font-family="${DISPLAY}" font-weight="800" font-size="16" letter-spacing="2" fill="#0E1726">${esc(p.brand.toUpperCase())}</text>
      <text x="200" y="224" text-anchor="middle" font-family="${MONO}" font-weight="600" font-size="24" fill="#0E1726">OF-101</text>
      ${ribs}`;
  }

  function specPlate(p) {
    const rows = (TP.specRows ? TP.specRows(p) : []).slice(0, 6);
    let body = "";
    rows.forEach(([k, v], i) => {
      const y = 116 + i * 40;
      body += `<text x="88" y="${y}" font-family="${DISPLAY}" font-size="13" font-weight="600" fill="#687684">${esc(k)}</text>`;
      body += `<text x="312" y="${y}" text-anchor="end" font-family="${MONO}" font-size="14" font-weight="600" fill="#17212B">${esc(v)}</text>`;
      body += `<line x1="88" y1="${y + 14}" x2="312" y2="${y + 14}" stroke="#E3E8ED"/>`;
    });
    return `
      <rect x="66" y="40" width="268" height="330" rx="14" fill="#FFFFFF" stroke="#D3DAE1" stroke-width="2"/>
      <text x="88" y="80" font-family="${DISPLAY}" font-weight="800" font-size="15" letter-spacing="1.5" fill="#0E1726">${esc(p.brand.toUpperCase())}</text>
      <rect x="252" y="64" width="60" height="22" rx="4" fill="#FF5A1F"/>
      <text x="282" y="80" text-anchor="middle" font-family="${MONO}" font-size="11" font-weight="600" fill="#0E1726">SPEC</text>
      ${body}`;
  }

  /** Views available for a product (used by the gallery). */
  TP.mediaViews = (p) => {
    // Real photos first (when provided in data), then the data-driven views
    if (p.images && p.images.length) {
      const photos = p.images.map((_, i) => ({ key: `photo-${i}`, label: p.images.length > 1 ? `Görünüş ${i + 1}` : "Məhsul şəkli" }));
      return p.category === "tyres"
        ? [...photos, { key: "tread", label: "Protektor" }, { key: "label", label: "EU etiketi" }]
        : [...photos, { key: "spec", label: "Texniki lövhə" }];
    }
    return p.category === "tyres"
      ? [{ key: "main", label: "Yan görünüş" }, { key: "tread", label: "Protektor" }, { key: "label", label: "EU etiketi" }]
      : [{ key: "main", label: "Əsas görünüş" }, { key: "spec", label: "Texniki lövhə" }];
  };

  /* A broken photo falls back to the generated illustration of the same product. */
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.classList.contains("media-img")) return;
    const p = TP.data && TP.data.byId(img.dataset.mediaId);
    img.outerHTML = TP.media(p, "main", { svgOnly: true });
  }, true);

  TP.media = (p, view = "main", { svgOnly = false } = {}) => {
    if (p && !svgOnly && p.images && p.images.length && (view === "main" || /^photo-\d+$/.test(view))) {
      const i = view === "main" ? 0 : Number(view.split("-")[1]);
      const alt = `${p.name}${p.size ? " " + p.size : ""}${i ? " — foto " + (i + 1) : ""}`;
      return `<img class="media-img" src="${esc(p.images[i] || p.images[0])}" alt="${esc(alt)}" loading="lazy" decoding="async" data-media-id="${esc(p.id)}">`;
    }
    if (!p) return svg("Şəkil yoxdur", `<rect x="60" y="60" width="280" height="280" rx="20" fill="none" stroke="#9AA6B2" stroke-dasharray="8 8"/><text x="200" y="206" text-anchor="middle" font-family="${DISPLAY}" font-size="16" fill="#9AA6B2">Şəkil yoxdur</text>`);
    const id = TP.uid("m");
    const label = `${p.name}${p.size ? " " + p.size : ""}`;
    try {
      if (view === "spec") return svg(`${label} — texniki lövhə`, specPlate(p));
      switch (p.category) {
        case "tyres":
          if (view === "tread") return svg(`${label} — protektor naxışı`, tyreTread(p, id));
          if (view === "label") return svg(`${label} — EU təkər etiketi`, euLabel(p));
          return svg(label, tyreFront(p, id));
        case "batteries": return svg(label, battery(p));
        case "rims": return svg(label, `<ellipse cx="200" cy="388" rx="140" ry="8" fill="#000" opacity=".15"/>${rimGroup(id, 200, 200, 178, p.finishKey)}`);
        case "oils": return svg(label, oil(p));
        case "parts":
        case "brakes": return svg(label, part(p));
        default: return TP.media(null);
      }
    } catch (e) {
      return TP.media(null);
    }
  };

  /** Large decorative tyre for the hero (uses a sample spec). */
  TP.heroTyre = () =>
    svg("205/55 R16 91V ölçülü təkər nümunəsi", tyreFront({ brand: "Zapçast", model: "Ölçü bələdçisi", size: "205/55 R16", load: 91, speed: "V" }, TP.uid("h"), { shadow: false }));

  TP.winterArt = () => svg("Qış təkərinin protektor naxışı", tyreTread({ season: "winter" }, TP.uid("w")), "60 0 280 400");
})();
