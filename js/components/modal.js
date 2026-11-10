/* Modal + Drawer with focus management (focus trap, Esc, return focus). */
(function () {
  "use strict";
  const TP = window.TP;
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const stack = [];

  function trap(e) {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === "Escape") { e.preventDefault(); top.close(); return; }
    if (e.key !== "Tab") return;
    const items = TP.$$(FOCUSABLE, top.panel).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) { e.preventDefault(); return; }
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener("keydown", trap);

  function lock() { document.body.classList.toggle("is-locked", stack.length > 0); }

  /**
   * Generic layer. `root` is the outer element (hidden attr toggled),
   * `panel` the focus container.
   */
  function makeLayer(root, panel, { onClose } = {}) {
    let returnTo = null;
    const layer = {
      root, panel,
      open(trigger) {
        if (!root.hidden) return;
        returnTo = trigger || document.activeElement;
        root.hidden = false;
        stack.push(layer);
        lock();
        const target = panel.querySelector("[autofocus]") || panel.querySelector(FOCUSABLE) || panel;
        requestAnimationFrame(() => target.focus({ preventScroll: true }));
      },
      close() {
        if (root.hidden) return;
        root.hidden = true;
        const i = stack.indexOf(layer);
        if (i > -1) stack.splice(i, 1);
        lock();
        if (onClose) onClose();
        if (returnTo && typeof returnTo.focus === "function") returnTo.focus({ preventScroll: true });
      },
      isOpen: () => !root.hidden,
    };
    root.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) layer.close();
    });
    return layer;
  }

  /** TP.modal({ title, content (Node|string html already escaped), wide }) */
  TP.modal = function ({ title, content, wide = false, onClose } = {}) {
    const titleId = TP.uid("mt");
    const root = document.createElement("div");
    root.className = "modal";
    root.hidden = true;
    root.innerHTML = `
      <div class="modal__overlay" data-close></div>
      <div class="modal__dialog ${wide ? "modal__dialog--wide" : ""}" role="dialog" aria-modal="true" aria-labelledby="${titleId}" tabindex="-1">
        <button type="button" class="icon-btn modal__close" data-close aria-label="Bağla">${TP.icon("close", 20)}</button>
        <h2 class="modal__title" id="${titleId}"></h2>
        <div class="modal__content"></div>
      </div>`;
    root.querySelector(".modal__title").textContent = title || "";
    const body = root.querySelector(".modal__content");
    if (typeof content === "string") body.innerHTML = content;
    else if (content) body.appendChild(content);
    document.body.appendChild(root);
    const layer = makeLayer(root, root.querySelector(".modal__dialog"), {
      onClose: () => { setTimeout(() => root.remove(), 0); if (onClose) onClose(); },
    });
    layer.body = body;
    layer.open();
    return layer;
  };

  /** TP.drawer(rootEl) — wraps existing drawer markup. */
  TP.drawer = function (root, opts) {
    return makeLayer(root, root.querySelector(".drawer__panel") || root, opts);
  };

  TP.layer = makeLayer;
})();
