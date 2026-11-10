/* Form validation — errors next to fields, demo submit (no backend). */
(function () {
  "use strict";
  const TP = window.TP;

  const RX = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^(\+?994|0)\d{9}$/,
  };
  const digits = (v) => String(v).replace(/[\s\-()]/g, "");

  function fieldWrap(input) {
    return input.closest(".field") || input.closest(".check") || input.parentElement;
  }

  function setError(input, msg) {
    const wrap = fieldWrap(input);
    if (!wrap) return;
    let err = wrap.querySelector(":scope > .field-error");
    if (msg) {
      if (!err) {
        err = document.createElement("p");
        err.className = "field-error";
        err.id = (input.id || TP.uid("f")) + "-err";
        wrap.appendChild(err);
      }
      err.textContent = msg;
      wrap.classList.add("has-error");
      input.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-describedby", err.id);
    } else {
      if (err) err.remove();
      wrap.classList.remove("has-error");
      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");
    }
  }

  function check(input) {
    const v = (input.value || "").trim();
    const rule = input.dataset.validate || (input.type === "email" ? "email" : input.type === "tel" ? "phone" : "");
    if (input.type === "checkbox") return input.required && !input.checked ? "Davam etmək üçün bu xananı işarələyin." : "";
    if (input.type === "radio") {
      if (!input.required) return "";
      const group = input.form ? input.form.querySelectorAll(`input[name="${CSS.escape(input.name)}"]`) : [];
      return Array.from(group).some((r) => r.checked) ? "" : "Variantlardan birini seçin.";
    }
    if (input.required && !v) return input.tagName === "SELECT" ? "Siyahıdan seçim edin." : "Bu sahəni doldurun.";
    if (!v) return "";
    if (rule === "email" && !RX.email.test(v)) return "E-mail ünvanını ad@domen.az formatında yazın.";
    if (rule === "phone" && !RX.phone.test(digits(v))) return "Telefonu +994 50 123 45 67 formatında yazın.";
    if (rule === "local-phone" && !/^0?\d{9}$/.test(digits(v))) return "Nömrəni 50 123 45 67 formatında yazın.";
    if (rule === "login" && !RX.email.test(v) && !RX.phone.test(digits(v))) return "E-mail və ya +994 ilə başlayan telefon nömrəsi yazın.";
    if (input.minLength > 0 && v.length < input.minLength) return `Ən azı ${input.minLength} simvol olmalıdır.`;
    if (input.type === "number" && v) {
      const n = Number(v);
      if (Number.isNaN(n)) return "Rəqəm daxil edin.";
      if (input.min !== "" && n < Number(input.min)) return `Minimum dəyər: ${input.min}.`;
      if (input.max !== "" && n > Number(input.max)) return `Maksimum dəyər: ${input.max}.`;
    }
    return "";
  }

  TP.forms = {
    validateField(input) { const m = check(input); setError(input, m); return !m; },
    /** Validate all fields inside `scope` (form or a step container). */
    validate(scope) {
      const inputs = TP.$$("input, select, textarea", scope).filter((i) => !i.disabled && i.type !== "hidden" && i.type !== "submit" && !i.closest("[hidden]"));
      const seenRadio = new Set();
      let first = null;
      inputs.forEach((i) => {
        if (i.type === "radio") {
          if (seenRadio.has(i.name)) return;
          seenRadio.add(i.name);
        }
        const msg = check(i);
        const target = i.type === "radio" ? (i.closest("fieldset") ? i.closest("fieldset").querySelector("input") : i) : i;
        if (i.type === "radio") {
          const fs = i.closest("fieldset");
          if (fs) {
            let err = fs.querySelector(":scope > .field-error");
            if (msg && !err) { err = document.createElement("p"); err.className = "field-error"; fs.appendChild(err); }
            if (err) { if (msg) err.textContent = msg; else err.remove(); }
          }
        } else setError(i, msg);
        if (msg && !first) first = target;
      });
      if (first) first.focus();
      return !first;
    },
    clearErrors(scope) { TP.$$("[aria-invalid]", scope).forEach((i) => setError(i, "")); TP.$$(".field-error", scope).forEach((e) => e.remove()); },
    data(form) {
      const out = {};
      new FormData(form).forEach((v, k) => { out[k] = out[k] ? [].concat(out[k], v) : v; });
      return out;
    },
    /** Bind demo submit. onSuccess(data, form) runs after a short simulated delay. */
    bind(form, { onSuccess, beforeSubmit, delay = 800, reset = false } = {}) {
      if (!form) return;
      form.noValidate = true;
      let attempted = false;
      // Re-check live once a field has been flagged, so errors clear while typing (not on blur, which shifts layout under the cursor).
      const live = (e) => { if (e.target.matches("input, select, textarea") && (attempted || e.target.getAttribute("aria-invalid") === "true")) TP.forms.validateField(e.target); };
      form.addEventListener("input", live);
      form.addEventListener("change", live);
      form.addEventListener("focusout", (e) => {
        const t = e.target;
        // Deferred so an error appearing on blur cannot shift a button away mid-click.
        if (t.matches("input, select, textarea") && t.value && t.getAttribute("aria-invalid") !== "true") setTimeout(() => TP.forms.validateField(t), 220);
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        attempted = true;
        const ok = TP.forms.validate(form) && (!beforeSubmit || beforeSubmit(form) !== false);
        if (!ok) {
          TP.toast({ type: "error", title: "Formda düzəliş lazımdır", text: "Qırmızı ilə qeyd olunmuş sahələri yoxlayın." });
          return;
        }
        const btn = form.querySelector('[type="submit"]');
        if (btn) { btn.disabled = true; btn.classList.add("is-loading"); btn.setAttribute("aria-busy", "true"); }
        setTimeout(() => {
          if (btn) { btn.disabled = false; btn.classList.remove("is-loading"); btn.removeAttribute("aria-busy"); }
          const data = TP.forms.data(form);
          if (onSuccess) onSuccess(data, form);
          if (reset) { form.reset(); attempted = false; TP.forms.clearErrors(form); }
        }, delay);
      });
    },
  };
})();
