/* Toast notifications */
(function () {
  "use strict";
  const TP = window.TP;
  let region;

  function ensureRegion() {
    if (region) return region;
    region = document.createElement("div");
    region.className = "toast-region";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    document.body.appendChild(region);
    return region;
  }

  /**
   * TP.toast({ title, text, type: "success"|"error"|"info", action: {label, href} })
   */
  TP.toast = function ({ title, text = "", type = "success", action = null, timeout = 4200 } = {}) {
    const host = ensureRegion();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    const icon = type === "error" ? "alert" : type === "info" ? "info" : "check";
    el.innerHTML = `
      <span class="toast__icon">${TP.icon(icon, 14)}</span>
      <div class="toast__body">
        <span class="toast__title"></span>
        ${text ? '<span class="toast__text"></span>' : ""}
        ${action ? `<a class="toast__action" href="${TP.esc(action.href)}"></a>` : ""}
      </div>
      <button type="button" class="toast__close" aria-label="Bildirişi bağla">${TP.icon("close", 16)}</button>`;
    el.querySelector(".toast__title").textContent = title || "";
    if (text) el.querySelector(".toast__text").textContent = text;
    if (action) el.querySelector(".toast__action").textContent = action.label;

    const remove = () => {
      if (!el.isConnected) return;
      el.classList.add("is-leaving");
      setTimeout(() => el.remove(), 220);
    };
    el.querySelector(".toast__close").addEventListener("click", remove);
    host.appendChild(el);
    while (host.children.length > 3) host.firstElementChild.remove();
    if (timeout) setTimeout(remove, timeout);
    return el;
  };
})();
