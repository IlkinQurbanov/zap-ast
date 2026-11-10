/* Service booking: branch → services → car → date → slot → contact. Demo only. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;
  const DAYS_AHEAD = 21;
  const BOOK_KEY = "tp.bookings.v1";
  const DOW = ["B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş.", "B."];
  const MONTHS = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];

  const HOURS = { "b-center": [9, 19, false], "b-north": [9, 20, true], "b-south": [10, 18, false] }; // open, close, sundays

  const st = { branch: "", date: "", slot: "", services: [] };
  let viewMonth; // Date at 1st of month

  const hash = (s) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  const bookings = () => TP.storage.get(BOOK_KEY, []) || [];
  const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };

  function dayOpen(d) {
    const t = today();
    const diff = Math.round((d - t) / 86400000);
    if (diff < 0 || diff > DAYS_AHEAD) return false;
    const h = HOURS[st.branch] || HOURS["b-center"];
    return d.getDay() !== 0 || h[2];
  }

  function slotsFor(dateIso) {
    const h = HOURS[st.branch] || HOURS["b-center"];
    const mine = bookings().filter((b) => b.branch === st.branch && b.date === dateIso).map((b) => b.slot);
    const now = new Date();
    const isToday = dateIso === TP.isoDate(today());
    const out = [];
    for (let m = h[0] * 60; m < h[1] * 60; m += 30) {
      const label = `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 ? "30" : "00"}`;
      const past = isToday && m <= now.getHours() * 60 + now.getMinutes() + 60;
      const busy = hash(`${st.branch}|${dateIso}|${label}`) % 4 === 0; // demo occupancy
      out.push({ label, disabled: past || busy || mine.includes(label), mine: mine.includes(label) });
    }
    return out;
  }

  function renderCalendar() {
    const host = TP.$("[data-calendar]");
    if (!st.branch) { host.innerHTML = `<p class="notice notice--info">${TP.icon("info", 18)}<span>Əvvəlcə filial seçin — iş günləri filiala görə dəyişir.</span></p>`; return; }
    const y = viewMonth.getFullYear(), m = viewMonth.getMonth();
    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(y, m + 1, 0).getDate();
    const t = today();
    const last = new Date(t.getFullYear(), t.getMonth(), t.getDate() + DAYS_AHEAD);
    const canPrev = new Date(y, m, 1) > new Date(t.getFullYear(), t.getMonth(), 1);
    const canNext = new Date(y, m + 1, 1) <= last;
    let cells = DOW.map((d) => `<span class="calendar__dow" aria-hidden="true">${d}</span>`).join("");
    for (let i = 0; i < offset; i++) cells += "<span></span>";
    for (let dnum = 1; dnum <= days; dnum++) {
      const d = new Date(y, m, dnum);
      const iso = TP.isoDate(d);
      const open = dayOpen(d);
      cells += `<button type="button" class="calendar__day ${iso === TP.isoDate(t) ? "is-today" : ""}" data-date="${iso}" aria-pressed="${iso === st.date}" ${open ? "" : "disabled"} aria-label="${esc(TP.fmtDate(d))}${open ? "" : ", seçilə bilməz"}">${dnum}</button>`;
    }
    host.innerHTML = `
      <div class="calendar">
        <div class="calendar__head">
          <button type="button" class="icon-btn" data-month="-1" aria-label="Əvvəlki ay" ${canPrev ? "" : "disabled"}>${TP.icon("chevron-left", 20)}</button>
          <span class="calendar__month" aria-live="polite">${MONTHS[m]} ${y}</span>
          <button type="button" class="icon-btn" data-month="1" aria-label="Növbəti ay" ${canNext ? "" : "disabled"}>${TP.icon("chevron-right", 20)}</button>
        </div>
        <div class="calendar__grid" role="group" aria-label="Tarix seçimi">${cells}</div>
        <p class="field-hint">Növbəti ${DAYS_AHEAD} gün üçün demo rezervasiya. ${HOURS[st.branch][2] ? "Bu filial bazar günü də işləyir." : "Bazar günü bu filial bağlıdır."}</p>
      </div>`;
  }

  function renderSlots() {
    const host = TP.$("[data-slots]");
    if (!st.date) { host.innerHTML = `<p class="muted fine">Tarix seçəndən sonra boş saatlar görünəcək.</p>`; return; }
    const slots = slotsFor(st.date);
    if (st.slot && !slots.some((s) => s.label === st.slot && !s.disabled)) st.slot = "";
    host.innerHTML = `<div class="slots" role="group" aria-label="Boş saatlar">${slots.map((s) =>
      `<button type="button" class="slot" data-slot="${s.label}" aria-pressed="${s.label === st.slot}" ${s.disabled ? "disabled" : ""} aria-label="${s.label}${s.mine ? ", sizin rezerviniz" : s.disabled ? ", məşğul" : ""}">${s.label}</button>`).join("")}</div>
      <div class="slots-legend"><span>${slots.filter((s) => !s.disabled).length} boş saat</span><span>Üstündən xətt çəkilmiş — məşğul (demo)</span></div>`;
  }

  function renderServices() {
    const branch = TP.data.branchById(st.branch);
    TP.$("[data-booking-services]").innerHTML = TP.data.services.map((s) => {
      const avail = !branch || branch.services.includes(s.id);
      if (!avail) st.services = st.services.filter((x) => x !== s.id);
      return `<label class="choice ${avail ? "" : "is-unavailable"}"><input type="checkbox" name="services" value="${s.id}" ${st.services.includes(s.id) ? "checked" : ""} ${avail ? "" : "disabled"}>
        <span class="choice__body"><span class="choice__title">${esc(s.name)}</span><span class="choice__meta">${avail ? esc(s.duration) + " · demo" : "Bu filialda göstərilmir"}</span></span></label>`;
    }).join("");
  }

  function renderSummary() {
    const branch = TP.data.branchById(st.branch);
    const car = [TP.$("#bk-make").value, TP.$("#bk-model").value.trim()].filter(Boolean).join(" ");
    const dateTxt = st.date ? TP.fmtDate(new Date(st.date + "T00:00:00")) : "";
    const rows = [
      ["Filial", branch ? branch.name : ""],
      ["Xidmət", st.services.map(TP.data.serviceName).join(", ")],
      ["Avtomobil", car],
      ["Tarix", dateTxt],
      ["Saat", st.slot],
    ];
    TP.$("[data-booking-summary]").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v ? esc(v) : '<span class="muted">seçilməyib</span>'}</dd></div>`).join("");
  }

  function err(key, msg) {
    const el = TP.$(`[data-err="${key}"]`);
    if (!el) return;
    el.textContent = msg || "";
    el.hidden = !msg;
  }

  TP.pages.booking = () => {
    const form = TP.$("#booking-form");
    if (!form) return;
    const q = TP.params();
    const t = today();
    viewMonth = new Date(t.getFullYear(), t.getMonth(), 1);

    TP.$("[data-booking-branches]").innerHTML = TP.data.branches.map((b) => `
      <label class="choice"><input type="radio" name="branch" value="${b.id}" required>
        <span class="choice__body"><span class="choice__title">${esc(b.name)}</span><span class="choice__meta">${esc(b.hours)}</span></span></label>`).join("");
    TP.$("#bk-make").innerHTML = `<option value="">Marka seçin</option>` + Object.keys(TP.data.vehicles).map((m) => `<option>${esc(m)}</option>`).join("") + "<option>Digər</option>";

    if (TP.data.branchById(q.get("branch"))) { st.branch = q.get("branch"); TP.$(`input[name="branch"][value="${st.branch}"]`).checked = true; }
    if (TP.data.services.some((s) => s.id === q.get("service"))) st.services = [q.get("service")];

    renderServices(); renderCalendar(); renderSlots(); renderSummary();

    form.addEventListener("change", (e) => {
      const tEl = e.target;
      if (tEl.name === "branch") { st.branch = tEl.value; st.date = ""; st.slot = ""; renderServices(); renderCalendar(); renderSlots(); }
      if (tEl.name === "services") { st.services = TP.$$('input[name="services"]:checked', form).map((c) => c.value); err("services", ""); }
      renderSummary();
    });
    form.addEventListener("input", (e) => { if (e.target.id === "bk-model") renderSummary(); });
    form.addEventListener("click", (e) => {
      const day = e.target.closest("[data-date]");
      if (day && !day.disabled) { st.date = day.dataset.date; st.slot = ""; err("date", ""); renderCalendar(); renderSlots(); renderSummary(); TP.$(`[data-date="${st.date}"]`).focus(); }
      const mon = e.target.closest("[data-month]");
      if (mon && !mon.disabled) { viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + Number(mon.dataset.month), 1); renderCalendar(); }
      const slot = e.target.closest("[data-slot]");
      if (slot && !slot.disabled) { st.slot = slot.dataset.slot; err("slot", ""); renderSlots(); renderSummary(); TP.$(`[data-slot="${st.slot}"]`).focus(); }
    });

    TP.forms.bind(form, {
      delay: 900,
      beforeSubmit: () => {
        let ok = true;
        if (!st.services.length) { err("services", "Ən azı bir xidmət seçin."); ok = false; }
        if (!st.date) { err("date", "Tarix seçin."); ok = false; }
        if (!st.slot) { err("slot", "Boş saatlardan birini seçin."); ok = false; }
        if (!ok) { const first = TP.$("[data-err]:not([hidden])"); if (first) first.closest(".panel").scrollIntoView({ behavior: "smooth", block: "start" }); }
        return ok;
      },
      onSuccess: (data) => {
        const all = bookings();
        const code = "SRV-DEMO-" + Math.random().toString(36).slice(2, 6).toUpperCase();
        all.push({ code, branch: st.branch, date: st.date, slot: st.slot, services: st.services });
        TP.storage.set(BOOK_KEY, all.slice(-20));
        const box = TP.$("[data-booking-success]");
        const branch = TP.data.branchById(st.branch);
        box.innerHTML = `<div class="co-success panel">
          <span class="co-success__icon">${TP.icon("check", 36)}</span>
          <h2 tabindex="-1">Demo rezervasiya təsdiqləndi</h2>
          <p class="muted">Bu prototipdir: müraciət serverə göndərilmir və filial tərəfindən təsdiqlənmir.</p>
          <span class="order-code">${code}</span>
          <div class="booking-summary co-success__dl"><dl>
            <div><dt>Filial</dt><dd>${esc(branch.name)}</dd></div>
            <div><dt>Xidmət</dt><dd>${esc(st.services.map(TP.data.serviceName).join(", "))}</dd></div>
            <div><dt>Vaxt</dt><dd>${esc(TP.fmtDate(new Date(st.date + "T00:00:00")))}, ${esc(st.slot)}</dd></div>
            <div><dt>Ad</dt><dd data-bk-name></dd></div>
          </dl></div>
          <div class="form-actions"><a class="btn btn--primary" href="booking.html">Yeni rezervasiya</a><a class="btn btn--outline" href="catalog.html?cat=tyres">Təkərlərə bax</a></div>
        </div>`;
        box.querySelector("[data-bk-name]").textContent = data.name || "";
        TP.$("[data-booking-layout]").hidden = true;
        box.hidden = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
        box.querySelector("h2").focus({ preventScroll: true });
      },
    });
  };
})();
