/* Services, Business (B2B) and Branches pages */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  TP.serviceCard = (s) => `
    <article class="service-card">
      <span class="service-card__icon">${TP.icon(s.icon, 28)}</span>
      <h3>${esc(s.name)}</h3>
      <p>${esc(s.desc)}</p>
      <div class="service-card__facts">
        <div><span>Müddət (demo)</span><b>${esc(s.duration)}</b></div>
        <div><span>Qiymət</span><b>Qiymət üçün müraciət</b></div>
      </div>
      <a class="btn btn--primary btn--block" href="booking.html?service=${encodeURIComponent(s.id)}">${TP.icon("calendar", 18)}Rezervasiya et</a>
    </article>`;

  TP.pages.services = () => {
    const grid = TP.$("[data-service-grid]");
    if (grid) grid.innerHTML = TP.data.services.map(TP.serviceCard).join("");
  };

  TP.pages.business = () => {
    const form = TP.$("#b2b-form");
    if (!form) return;
    const interest = TP.$("#b2b-interest");
    interest.innerHTML = `<option value="">Seçin</option>` + ["Təkərlər", "Akkumulyatorlar", "Disklər", "Mühərrik yağları", "Ehtiyat hissələri", "Servis xidmətləri", "Kompleks təchizat"].map((x) => `<option>${x}</option>`).join("");
    TP.forms.bind(form, {
      delay: 1000,
      onSuccess: (data) => {
        const box = TP.$("[data-b2b-success]");
        box.innerHTML = `<div class="co-success panel">
          <span class="co-success__icon">${TP.icon("check", 36)}</span>
          <h2 tabindex="-1">Müraciət yoxlanıldı</h2>
          <p class="muted" data-b2b-msg></p>
          <div class="notice notice--demo">${TP.icon("info", 18)}<span>Demo rejim: forma backend-ə göndərilmir. Real inteqrasiyada satış meneceri sizinlə əlaqə saxlayacaq.</span></div>
          <button type="button" class="btn btn--outline" data-b2b-again>Yeni müraciət</button>
        </div>`;
        box.querySelector("[data-b2b-msg]").textContent = `${data.company} üçün “${data.interest}” müraciəti formatca düzgündür.`;
        form.hidden = true;
        box.hidden = false;
        box.querySelector("h2").focus();
        box.querySelector("[data-b2b-again]").addEventListener("click", () => {
          form.reset(); TP.forms.clearErrors(form); form.hidden = false; box.hidden = true; TP.$("#b2b-company").focus();
        });
      },
    });
  };

  function mapArt(seed) {
    let roads = "";
    for (let i = 0; i < 5; i++) {
      const y = 20 + ((seed * 37 + i * 53) % 160);
      roads += `<path d="M0 ${y} C 120 ${y + 30}, 260 ${y - 40}, 400 ${y + 10}" fill="none" stroke="currentColor" stroke-opacity=".18" stroke-width="${i === 2 ? 10 : 4}"/>`;
    }
    for (let i = 0; i < 4; i++) {
      const x = 40 + ((seed * 61 + i * 97) % 320);
      roads += `<path d="M${x} 0 L ${x + 30} 200" stroke="currentColor" stroke-opacity=".14" stroke-width="4"/>`;
    }
    return `<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${roads}
      <circle cx="200" cy="100" r="34" fill="#FF5A1F" fill-opacity=".18"/>
      <path d="M200 120s-18-16-18-30a18 18 0 0 1 36 0c0 14-18 30-18 30Z" fill="#FF5A1F"/><circle cx="200" cy="90" r="6" fill="#0E1726"/></svg>`;
  }

  TP.branchCard = (b, i) => `
    <article class="branch-card" data-services="${esc(b.services.join(" "))}">
      <div class="branch-card__map">${mapArt(i + 1)}<span class="badge badge--demo">Demo məlumat</span></div>
      <div class="branch-card__body">
        <h3>${esc(b.name)}</h3>
        <ul class="branch-info" role="list">
          <li>${TP.icon("pin", 16)}<span>Ünvan təsdiqlənəcək · ${esc(b.district)}</span></li>
          <li>${TP.icon("phone", 16)}<span>Telefon təsdiqlənəcək</span></li>
          <li>${TP.icon("clock", 16)}<span>${esc(b.hours)}</span></li>
          <li>${TP.icon("wrench", 16)}<span>${esc(b.services.map(TP.data.serviceName).join(", "))}</span></li>
          ${b.pickup ? `<li>${TP.icon("store", 16)}<span>Sifarişi filialdan götürmək mümkündür</span></li>` : ""}
        </ul>
      </div>
      <div class="branch-card__actions">
        <button type="button" class="btn btn--outline" data-map>${TP.icon("map", 18)}Xəritədə aç</button>
        <a class="btn btn--primary" href="booking.html?branch=${encodeURIComponent(b.id)}">Rezervasiya</a>
      </div>
    </article>`;

  TP.pages.branches = () => {
    const grid = TP.$("[data-branch-grid]");
    if (!grid) return;
    grid.innerHTML = TP.data.branches.map(TP.branchCard).join("");
    const chips = TP.$("[data-branch-filter]");
    const used = Array.from(new Set(TP.data.branches.flatMap((b) => b.services)));
    chips.innerHTML = `<button type="button" class="chip" aria-pressed="true" data-svc="">Bütün filiallar</button>` +
      used.map((id) => `<button type="button" class="chip" aria-pressed="false" data-svc="${id}">${esc(TP.data.serviceName(id))}</button>`).join("");
    const count = TP.$("[data-branch-count]");
    const apply = (svc) => {
      let n = 0;
      TP.$$(".branch-card", grid).forEach((c) => { const show = !svc || c.dataset.services.split(" ").includes(svc); c.hidden = !show; n += show; });
      count.textContent = `${n} filial`;
    };
    chips.addEventListener("click", (e) => {
      const b = e.target.closest("[data-svc]");
      if (!b) return;
      TP.$$("[data-svc]", chips).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply(b.dataset.svc);
    });
    grid.addEventListener("click", (e) => {
      if (e.target.closest("[data-map]")) TP.toast({ type: "info", title: "Xəritə linki hazır deyil", text: "Real ünvan təsdiqləndikdən sonra xəritə linki əlavə olunacaq." });
    });
    apply("");
  };
})();
