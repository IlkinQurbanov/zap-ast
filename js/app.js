/* App bootstrap: renders shared layout, then runs the page module
   named in <main data-page="...">. */
(function () {
  "use strict";
  const TP = window.TP;
  function start() {
    const main = document.getElementById("main");
    const page = main ? main.dataset.page : "";
    // Hydrate static icon placeholders: <span data-icon="search" data-size="18"></span>
    TP.$$("[data-icon]").forEach((el) => {
      el.outerHTML = TP.icon(el.dataset.icon, Number(el.dataset.size) || 20);
    });
    try {
      TP.initLayout(page);
    } catch (e) {
      console.error("[Zapçast] layout:", e);
    }
    const init = TP.pages[page];
    if (typeof init === "function") {
      try { init(); } catch (e) { console.error(`[Zapçast] page "${page}":`, e); }
    }
    document.documentElement.classList.add("is-ready");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
