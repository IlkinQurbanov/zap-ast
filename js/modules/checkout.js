/* Demo checkout: 4 steps, live order summary, no real payment. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;
  const AZ_DAYS = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
  const AZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
  TP.fmtDate = (d) => `${d.getDate()} ${AZ_MONTHS[d.getMonth()]}, ${AZ_DAYS[d.getDay()]}`;
  TP.isoDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  let step = 1;
  const MAX = 4;

  const val = (name) => { const el = TP.$(`[name="${name}"]:checked`) || TP.$(`[name="${name}"]`); return el ? el.value : ""; };

  function branchCards(name, required = true) {
    return TP.data.branches.map((b) => `
      <label class="choice"><input type="radio" name="${name}" value="${b.id}" ${required ? "required" : ""}>
        <span class="choice__body"><span class="choice__title">${esc(b.name)}</span><span class="choice__meta">${esc(b.district)} · ${esc(b.hours)}</span></span></label>`).join("");
  }

  function fillStaticParts() {
    TP.$("[data-branch-choices]").innerHTML = branchCards("branch");
    TP.$("[data-co-services]").innerHTML = TP.data.services.map((s) => `
      <label class="check"><input type="checkbox" name="services" value="${s.id}">${esc(s.name)} <span class="muted">· ${esc(s.duration)}</span></label>`).join("");
    const svcBranch = TP.$("#co-svc-branch");
    svcBranch.innerHTML = `<option value="">Filial seçin</option>` + TP.data.branches.map((b) => `<option value="${b.id}">${esc(b.name)}</option>`).join("");
    const date = TP.$("#co-svc-date");
    let opts = `<option value="">Tarix seçin</option>`;
    const d = new Date();
    for (let i = 1, added = 0; added < 10 && i < 20; i++) {
      const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
      if (x.getDay() === 0) continue;
      opts += `<option value="${TP.isoDate(x)}">${TP.fmtDate(x)}</option>`;
      added++;
    }
    date.innerHTML = opts;
    const time = TP.$("#co-svc-time");
    let t = `<option value="">Saat seçin</option>`;
    for (let h = 9; h <= 18; h++) t += `<option>${String(h).padStart(2, "0")}:00</option>`;
    time.innerHTML = t;
  }

  function syncConditionals() {
    const method = val("method");
    TP.$$("[data-when]").forEach((el) => {
      const cond = el.dataset.when;
      if (cond === "address") el.hidden = method !== "address";
      else if (cond === "pickup") el.hidden = method !== "pickup";
      else if (cond === "service") el.hidden = !TP.$("#co-add-service").checked;
      else if (cond === "svc-branch") el.hidden = method === "pickup";
    });
    renderSummary();
  }

  function renderSummary() {
    const method = val("method") || "address";
    const t = TP.orderTotals(method);
    TP.$("[data-co-items]").innerHTML = TP.cart.items().map(({ product: p, qty }) => `
      <div class="mini-line"><span class="mini-line__media">${TP.media(p)}</span>
        <div><span class="mini-line__title">${esc(p.name)}</span><span class="mini-line__meta">${esc(TP.data.sizeLabel(p))} · ${qty} əd.</span></div>
        <span class="mini-line__price">${TP.money(p.price * qty)}</span></div>`).join("");
    const services = TP.$("#co-add-service") && TP.$("#co-add-service").checked ? TP.$$('[name="services"]:checked').map((c) => TP.data.serviceName(c.value)) : [];
    TP.$("[data-co-rows]").innerHTML = `
      <div class="summary-row"><span>Məhsullar</span><span>${TP.money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="summary-row is-discount"><span>Kupon ${esc(t.code)}</span><span>−${TP.money(t.discount)}</span></div>` : ""}
      <div class="summary-row"><span>${method === "pickup" ? "Filialdan götürmə" : "Ünvana çatdırılma"}</span><span>${t.delivery ? TP.money(t.delivery) : "Pulsuz"}</span></div>
      ${services.length ? `<div class="summary-row"><span>Servis: ${esc(services.join(", "))}</span><span class="muted">Filialda</span></div>` : ""}`;
    TP.$("[data-co-total]").textContent = TP.money(t.total);
  }

  function goTo(n, { focus = true } = {}) {
    step = Math.max(1, Math.min(MAX, n));
    TP.$$(".co-panel").forEach((p) => { p.hidden = Number(p.dataset.step) !== step; });
    TP.$$("[data-goto]").forEach((b) => {
      const s = Number(b.dataset.goto);
      b.classList.toggle("is-done", s < step);
      b.disabled = s > step;
      if (s === step) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.querySelector(".step-num").innerHTML = s < step ? TP.icon("check", 14) : String(s);
    });
    if (focus) {
      const panel = TP.$(`.co-panel[data-step="${step}"]`);
      const h = panel.querySelector("h2");
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
      const top = TP.$("[data-co-layout]").getBoundingClientRect().top + window.scrollY - 100;
      if (window.scrollY > top) window.scrollTo({ top, behavior: "smooth" });
    }
  }

  function success(data) {
    const code = "ZP-DEMO-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const t = TP.orderTotals(data.method);
    const branch = TP.data.branchById(data.branch);
    const box = TP.$("[data-co-success]");
    const pay = { card: "Bank kartı (demo)", cash: "Nağd (demo)", installment: "Taksit (demo)" }[data.payment] || "—";
    box.innerHTML = `
      <div class="co-success panel">
        <span class="co-success__icon">${TP.icon("check", 36)}</span>
        <h2>Demo sifariş qeydə alındı</h2>
        <p class="muted">Bu prototipdir: sifariş serverə göndərilməyib, ödəniş alınmayıb.</p>
        <span class="order-code">${code}</span>
        <div class="booking-summary co-success__dl"><dl>
          <div><dt>Ad</dt><dd></dd></div>
          <div><dt>Çatdırılma</dt><dd>${data.method === "pickup" ? esc(branch ? branch.name : "Filial") : "Ünvana çatdırılma"}</dd></div>
          <div><dt>Ödəniş</dt><dd>${esc(pay)}</dd></div>
          <div><dt>Cəmi</dt><dd>${TP.money(t.total)}</dd></div>
        </dl></div>
        <div class="form-actions"><a class="btn btn--primary" href="index.html">Ana səhifəyə qayıt</a><a class="btn btn--outline" href="catalog.html">Alış-verişə davam et</a></div>
      </div>`;
    box.querySelector("dd").textContent = data.name || "";
    TP.$("[data-co-layout]").hidden = true;
    box.hidden = false;
    TP.cart.clear();
    TP.coupon.set("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    box.querySelector("h2").setAttribute("tabindex", "-1");
    box.querySelector("h2").focus({ preventScroll: true });
  }

  TP.pages.checkout = () => {
    const form = TP.$("#checkout-form");
    if (!form) return;
    if (!TP.cart.count()) {
      TP.$("[data-co-layout]").hidden = true;
      TP.$("[data-co-empty]").hidden = false;
      return;
    }
    fillStaticParts();
    form.addEventListener("change", syncConditionals);
    form.addEventListener("click", (e) => {
      if (e.target.closest("[data-next]")) {
        e.preventDefault();
        const panel = TP.$(`.co-panel[data-step="${step}"]`);
        if (TP.forms.validate(panel)) goTo(step + 1);
      }
      if (e.target.closest("[data-prev]")) { e.preventDefault(); goTo(step - 1); }
    });
    TP.$$("[data-goto]").forEach((b) => b.addEventListener("click", () => { if (Number(b.dataset.goto) < step) goTo(Number(b.dataset.goto)); }));
    TP.forms.bind(form, {
      delay: 1100,
      beforeSubmit: () => step === MAX,
      onSuccess: (data) => success(data),
    });
    // Enter key in earlier steps should advance, not submit.
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && step < MAX && e.target.matches("input:not([type=checkbox]):not([type=radio])")) {
        e.preventDefault();
        TP.$(`.co-panel[data-step="${step}"] [data-next]`).click();
      }
    });
    TP.on("tp:cart", () => { if (TP.cart.count()) renderSummary(); });
    syncConditionals();
    goTo(1, { focus: false });
  };
})();
