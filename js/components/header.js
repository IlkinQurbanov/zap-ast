/* Header (top bar, main header, nav, search), mobile menu, cart drawer,
   footer and info modals. Rendered once per page from this file so the
   markup is not duplicated across HTML pages. */
(function () {
  "use strict";
  const TP = window.TP;
  const esc = TP.esc;

  /* Main menu mirrors the reference structure: product groups with sub-menus,
     then service and campaigns. */
  const NAV = [
    { label: "Təkərlər", mega: "tyres", match: "cat=tyres" },
    { label: "Akkumulyatorlar", mega: "batteries", match: "cat=batteries" },
    { href: "catalog.html?cat=rims", label: "Disklər", match: "cat=rims" },
    { label: "Yağlar", mega: "oils", match: "cat=oils" },
    { href: "catalog.html?cat=parts", label: "Ehtiyat hissələri", match: "cat=parts" },
    { href: "catalog.html?cat=brakes", label: "Əyləc bəndləri", match: "cat=brakes" },
    { href: "services.html", label: "Servis", page: "services" },
  ];

  const TOP_LINKS = [
    { label: "Haqqımızda", info: "about" },
    { label: "Brendlər", href: "index.html#brands" },
    { label: "Bloq", href: "index.html#blog" },
    { label: "Video", href: "index.html#video" },
    { label: "Dəstək", info: "support" },
    { label: "Filiallar", href: "branches.html" },
  ];

  const isCurrent = (item, page) => {
    if (item.page) return item.page === page;
    return page === "catalog" && window.location.search.includes(item.match);
  };

  /* ---------------- Search ---------------- */
  TP.searchProducts = (q, list = TP.data.products) => {
    const query = String(q || "").trim();
    if (!query) return list.slice();
    const size = TP.parseSize(query);
    if (size) {
      return list.filter((p) => p.category === "tyres" && p.width === size.width && p.profile === size.profile && (!size.diameter || p.diameter === size.diameter));
    }
    const tokens = TP.norm(query).split(" ").filter(Boolean);
    return list.filter((p) => {
      const hay = TP.norm([p.name, p.brand, p.model, p.sku, TP.data.sizeLabel(p), TP.data.catName(p.category), p.season ? TP.data.SEASON[p.season].label : ""].join(" "));
      const compact = hay.replace(/[-\s·]/g, "");
      return tokens.every((t) => hay.includes(t) || compact.includes(t.replace(/-/g, "")));
    });
  };

  function searchMarkup(id) {
    return `
      <div class="search" role="search">
        <form class="search__form" action="catalog.html" method="get" data-search-form>
          <label class="sr-only" for="${id}">Məhsul və ya təkər ölçüsü axtar</label>
          <span class="search__icon">${TP.icon("search", 20)}</span>
          <input class="search__input" id="${id}" name="q" type="search" autocomplete="off"
            placeholder="Axtar: 205/55 R16, 60Ah, 5W-30, brend…"
            role="combobox" aria-expanded="false" aria-controls="${id}-list" aria-autocomplete="list">
          <button class="btn btn--primary btn--sm search__submit" type="submit">Axtar</button>
        </form>
        <div class="suggest" id="${id}-list" role="listbox" aria-label="Axtarış təklifləri" hidden></div>
      </div>`;
  }

  function wireSearch(root) {
    const form = root.querySelector("[data-search-form]");
    const input = form.querySelector("input");
    const list = root.querySelector(".suggest");
    let active = -1;

    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; };
    const render = () => {
      const q = input.value.trim();
      if (q.length < 2) { close(); return; }
      const results = TP.searchProducts(q).slice(0, 6);
      if (!results.length) {
        list.innerHTML = `<div class="suggest__empty"></div>`;
        list.firstElementChild.textContent = `"${q}" üzrə nəticə tapılmadı. Ölçünü 205/55 R16 formatında yoxlayın.`;
      } else {
        list.innerHTML = results.map((p, i) => `
          <a class="suggest__item" role="option" id="${input.id}-o${i}" href="${TP.productUrl(p)}">
            <span class="suggest__media">${TP.media(p)}</span>
            <span><span class="suggest__title">${esc(p.name)}</span><br><span class="suggest__meta">${esc(TP.data.sizeLabel(p))}</span></span>
            <span class="suggest__price">${TP.money(p.price)}</span>
          </a>`).join("") + `<a class="suggest__all" href="catalog.html?q=${encodeURIComponent(q)}">Bütün nəticələr →</a>`;
      }
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      active = -1;
    };

    input.addEventListener("input", TP.debounce(render, 120));
    input.addEventListener("focus", render);
    input.addEventListener("keydown", (e) => {
      const opts = TP.$$(".suggest__item", list);
      if (list.hidden || !opts.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active = (active + (e.key === "ArrowDown" ? 1 : -1) + opts.length) % opts.length;
        opts.forEach((o, i) => o.classList.toggle("is-active", i === active));
        input.setAttribute("aria-activedescendant", opts[active].id);
      } else if (e.key === "Enter" && active > -1) {
        e.preventDefault();
        window.location.href = opts[active].href;
      } else if (e.key === "Escape") {
        close();
      }
    });
    form.addEventListener("submit", (e) => {
      if (!input.value.trim()) { e.preventDefault(); input.focus(); }
    });
    document.addEventListener("click", (e) => { if (!root.contains(e.target)) close(); });
  }

  /* ---------------- Header ---------------- */
  const countIn = (cat, extra = () => true) => TP.data.products.filter((p) => p.category === cat && extra(p)).length;

  function megaPanel(cat) {
    const subs = TP.data.subcats[cat] || [];
    const subLinks = subs.map((x) => {
      const n = countIn(cat, (p) => p.sub === x.id);
      const seasons = x.seasons
        ? `<span class="mega__seasons">${[["summer", "Yay"], ["winter", "Qış"], ["all", "4 fəsil"]].map(([v, l]) => `<a href="catalog.html?cat=${cat}&sub=${x.id}&season=${v}">${l}</a>`).join("")}</span>`
        : "";
      return `<li><a class="mega__link" href="catalog.html?cat=${cat}&sub=${x.id}"><span>${esc(x.name)}</span><small>${n ? n + " məhsul" : "tezliklə"}</small></a>${seasons}</li>`;
    }).join("");
    let aside = "";
    if (cat === "tyres") {
      aside = `<div class="mega__col"><p class="mega__title">Mövsüm</p><ul role="list">${[["summer", "Yay təkərləri", "sun"], ["winter", "Qış təkərləri", "snow"], ["all", "4 fəsil təkərləri", "season"]].map(([v, l, i]) => `<li><a class="mega__chip" href="catalog.html?cat=tyres&season=${v}">${TP.icon(i, 16)}${l}</a></li>`).join("")}</ul>
        <a class="btn btn--primary btn--sm mega__cta" href="index.html#finder">${TP.icon("search", 16)}Ölçüyə görə axtar</a></div>`;
    } else if (cat === "batteries") {
      aside = `<div class="mega__col"><p class="mega__title">Texnologiya</p><ul role="list">${[["Standart", "Standart tip"], ["EFB", "Start-Stop EFB"], ["AGM", "Start-Stop AGM"]].map(([v, l]) => `<li><a class="mega__chip" href="catalog.html?cat=batteries&tech=${v}">${l}<small>${countIn("batteries", (p) => p.tech === v)}</small></a></li>`).join("")}</ul></div>
        <div class="mega__col"><p class="mega__title">Tutum</p><div class="mega__pills">${[45, 55, 60, 70, 80, 95].map((ah) => `<a href="catalog.html?cat=batteries&ah=${ah}">${ah} Ah</a>`).join("")}</div></div>`;
    } else if (cat === "oils") {
      aside = `<div class="mega__col"><p class="mega__title">Özlülük (SAE)</p><div class="mega__pills">${["0W-20", "5W-30", "5W-40", "10W-40", "75W-90"].map((v) => `<a href="catalog.html?cat=oils&visc=${encodeURIComponent(v)}">${v}</a>`).join("")}</div>
        <p class="mega__title">Həcm</p><div class="mega__pills"><a href="catalog.html?cat=oils&vol=1">1 L</a><a href="catalog.html?cat=oils&vol=4">4 L</a></div></div>`;
    }
    const catName = TP.data.catName(cat);
    return `<div class="mega" id="mega-${cat}" hidden>
      <div class="mega__col mega__col--main"><p class="mega__title">${esc(catName)}</p><ul class="mega__list ${subs.length > 4 ? "mega__list--2" : ""}" role="list">${subLinks}</ul>
        <a class="link mega__all" href="catalog.html?cat=${cat}">Bütün ${esc(catName.toLocaleLowerCase("az"))} →</a></div>
      ${aside}
    </div>`;
  }

  function headerMarkup(page) {
    const navItems = NAV.map((n) => {
      const current = isCurrent(n, page) ? 'aria-current="page"' : "";
      if (n.mega) {
        return `<li class="dropdown dropdown--mega"><button type="button" class="nav-link" ${current ? 'data-current="true"' : ""} aria-expanded="false" aria-controls="mega-${n.mega}" data-dropdown>${esc(n.label)}${TP.icon("chevron-down", 16)}</button></li>`;
      }
      return `<li><a class="nav-link" href="${n.href}" ${current}>${esc(n.label)}</a></li>`;
    }).join("");
    const top = TOP_LINKS.map((l) => l.info ? `<a href="#" data-info="${l.info}">${esc(l.label)}</a>` : `<a href="${l.href}">${esc(l.label)}</a>`).join("");
    const saleCurrent = page === "catalog" && TP.params().get("sale") === "1" ? 'aria-current="page"' : "";
    return `
      <a class="skip-link" href="#main">Əsas məzmuna keç</a>
      <div class="announce"><p class="container announce__inner">${TP.icon("truck", 16)}<span>${TP.pricing.FREE_DELIVERY_FROM} ₼-dan yuxarı sifarişlərə pulsuz çatdırılma (demo şərt)</span><a href="catalog.html?sale=1">Kampaniyalar →</a></p></div>
      <div class="topbar">
        <div class="container topbar__inner">
          <nav class="topbar__links topbar__links--start" aria-label="Məlumat">${top}</nav>
          <div class="topbar__links">
            <a href="#" class="topbar__phone" data-info="support">${TP.icon("phone", 14)}Qaynar xətt</a>
            <a href="business.html#b2b-form-section" class="topbar__extra">Korporativ müraciət</a>
            <a href="#" class="topbar__extra" data-credit>Kredit müraciəti</a>
            <div class="lang" role="group" aria-label="Dil">
              <button type="button" aria-pressed="true" data-lang="az">AZ</button><button type="button" aria-pressed="false" data-lang="en">EN</button><button type="button" aria-pressed="false" data-lang="ru">RU</button>
            </div>
          </div>
        </div>
      </div>
      <header class="site-header" id="site-header">
        <div class="container header-main">
          <button type="button" class="icon-btn header-burger" aria-label="Menyunu aç" aria-controls="mobile-nav" aria-expanded="false" data-open-menu>${TP.icon("menu", 24)}</button>
          <a class="logo" href="index.html" aria-label="Zapçast.az ana səhifə">${TP.logoMark()}<span class="logo__word">Zap<span>çast</span></span><span class="logo__tld">.az</span></a>
          <div class="header-search">${searchMarkup("site-search")}</div>
          <div class="header-actions">
            <button type="button" class="icon-btn header-search-toggle" aria-label="Axtarışı aç" aria-expanded="false" data-toggle-search>${TP.icon("search", 22)}</button>
            <button type="button" class="icon-btn icon-btn--account" aria-label="Hesab / daxil ol" data-open-account>${TP.icon("user", 22)}</button>
            <a class="icon-btn" href="catalog.html?fav=1" aria-label="Favoritlər">${TP.icon("heart", 22)}<span class="count" data-fav-count></span></a>
            <button type="button" class="icon-btn" aria-label="Səbət" aria-controls="cart-drawer" data-open-cart>${TP.icon("cart", 22)}<span class="count" data-cart-count></span></button>
          </div>
        </div>
        <nav class="header-nav" aria-label="Əsas naviqasiya">
          <div class="container header-nav__inner">
            <ul class="nav-list" role="list">
              ${navItems}
              <li class="nav-spacer" aria-hidden="true"></li>
              <li><a class="nav-link nav-link--sale" href="catalog.html?sale=1" ${saleCurrent}>${TP.icon("percent", 16)}Kampaniyalar</a></li>
            </ul>
            ${megaPanel("tyres")}${megaPanel("batteries")}${megaPanel("oils")}
          </div>
        </nav>
      </header>`;
  }

  function drawersMarkup(page) {
    const mobileLinks = [
      { href: "index.html", label: "Ana səhifə", icon: "store", page: "home" },
      { href: "catalog.html?sale=1", label: "% Kampaniyalar", icon: "percent", match: "sale=1" },
    ];
    const groups = TP.data.categories.filter((c) => c.id !== "services").map((c) => {
      const subs = TP.data.subcats[c.id];
      if (!subs) return `<li><a href="${c.href}">${TP.icon(c.icon, 20)}${esc(c.name)}</a></li>`;
      return `<li><details class="mobile-nav__details"><summary>${TP.icon(c.icon, 20)}${esc(c.name)}${TP.icon("chevron-down", 18)}</summary>
        <ul role="list"><li><a href="${c.href}">Hamısı</a></li>${subs.map((x) => `<li><a href="catalog.html?cat=${c.id}&sub=${x.id}">${esc(x.name)}</a></li>`).join("")}</ul></details></li>`;
    }).join("");
    const extra = [
      { href: "services.html", label: "Servis xidmətləri", icon: "wrench", page: "services" },
      { href: "booking.html", label: "Servis rezervasiyası", icon: "calendar", page: "booking" },
      { href: "business.html", label: "Korporativ müştərilər", icon: "building", page: "business" },
      { href: "branches.html", label: "Filiallar", icon: "pin", page: "branches" },
      { href: "catalog.html?fav=1", label: "Favoritlər", icon: "heart", match: "fav=1" },
    ];
    const li = (n) => `<li><a href="${n.href}" ${isCurrent(n, page) ? 'aria-current="page"' : ""}>${TP.icon(n.icon, 20)}${esc(n.label)}</a></li>`;
    return `
      <div class="drawer drawer--left" id="mobile-nav" hidden>
        <div class="drawer__overlay" data-close></div>
        <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menyu">
          <div class="drawer__head"><a class="logo logo--plain" href="index.html">${TP.logoMark()}<span class="logo__word">Zap<span>çast</span></span></a>
            <button type="button" class="icon-btn" data-close aria-label="Menyunu bağla">${TP.icon("close", 22)}</button></div>
          <div class="drawer__body">
            <ul class="mobile-nav__list" role="list">${mobileLinks.map(li).join("")}${groups}</ul>
            <p class="eyebrow mobile-nav__group">Xidmətlər və şirkət</p>
            <ul class="mobile-nav__list" role="list">${extra.map(li).join("")}</ul>
          </div>
          <div class="drawer__foot">
            <button type="button" class="btn btn--outline btn--block" data-open-account>${TP.icon("user", 18)}Daxil ol</button>
            <button type="button" class="btn btn--ghost btn--block" data-credit>${TP.icon("card", 18)}Kredit müraciəti</button>
          </div>
        </div>
      </div>
      <div class="drawer" id="cart-drawer" hidden>
        <div class="drawer__overlay" data-close></div>
        <div class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title">
          <div class="drawer__head"><h2 id="cart-drawer-title">Səbət</h2>
            <button type="button" class="icon-btn" data-close aria-label="Səbəti bağla">${TP.icon("close", 22)}</button></div>
          <div class="drawer__body" data-cart-drawer-body></div>
          <div class="drawer__foot" data-cart-drawer-foot></div>
        </div>
      </div>`;
  }

  function renderCartDrawer() {
    const body = TP.$("[data-cart-drawer-body]");
    const foot = TP.$("[data-cart-drawer-foot]");
    if (!body) return;
    const items = TP.cart.items();
    if (!items.length) {
      body.innerHTML = `<div class="empty empty--plain"><span class="empty__icon">${TP.icon("cart", 28)}</span><h3>Səbət boşdur</h3><p>Avtomobilinizə uyğun təkəri ölçüyə görə tapın.</p><a class="btn btn--primary" href="catalog.html?cat=tyres">Təkərlərə bax</a></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = items.map(({ product: p, qty }) => `
      <div class="mini-line">
        <a class="mini-line__media" href="${TP.productUrl(p)}" tabindex="-1" aria-hidden="true">${TP.media(p)}</a>
        <div><a class="mini-line__title" href="${TP.productUrl(p)}">${esc(p.name)}</a>
          <div class="mini-line__meta">${esc(TP.data.sizeLabel(p))} · ${qty} əd.</div>
          <button type="button" class="remove-btn remove-btn--flush" data-remove="${esc(p.id)}">${TP.icon("trash", 14)}Sil</button></div>
        <div class="mini-line__price">${TP.money(p.price * qty)}</div>
      </div>`).join("");
    const sub = TP.cart.subtotal();
    const left = TP.pricing.FREE_DELIVERY_FROM - sub;
    foot.innerHTML = `
      <div class="summary-row"><span>Ara cəm</span><b>${TP.money(sub)}</b></div>
      <p class="muted fine">${left > 0 ? `Pulsuz çatdırılmaya ${TP.money(left)} qalıb (demo qayda).` : "Ünvana çatdırılma pulsuzdur (demo qayda)."}</p>
      <a class="btn btn--primary btn--block btn--lg" href="checkout.html">Sifarişi rəsmiləşdir</a>
      <a class="btn btn--outline btn--block" href="cart.html">Səbətə keç</a>`;
  }

  function updateCounts() {
    TP.$$("[data-cart-count]").forEach((el) => { const n = TP.cart.count(); el.textContent = n || ""; el.dataset.count = n; });
    TP.$$("[data-fav-count]").forEach((el) => { const n = TP.fav.count(); el.textContent = n || ""; el.dataset.count = n; });
    const cartBtn = TP.$("[data-open-cart]");
    if (cartBtn) cartBtn.setAttribute("aria-label", `Səbət, ${TP.cart.count()} məhsul`);
  }

  /* ---------------- Footer ---------------- */
  function footerMarkup() {
    const cats = TP.data.categories.map((c) => `<li><a href="${c.href}">${esc(c.name)}</a></li>`).join("");
    const subLinks = [
      ...TP.data.subcats.tyres.map((x) => ({ href: `catalog.html?cat=tyres&sub=${x.id}`, label: x.name })),
      ...TP.data.subcats.batteries.map((x) => ({ href: `catalog.html?cat=batteries&sub=${x.id}`, label: x.name })),
      ...TP.data.subcats.oils.map((x) => ({ href: `catalog.html?cat=oils&sub=${x.id}`, label: x.name })),
    ].map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join("");
    return `
      <footer class="site-footer">
        <div class="container footer-top">
          <div class="footer-brand">
            <a class="logo" href="index.html">${TP.logoMark()}<span class="logo__word">Zap<span>çast</span></span><span class="logo__tld">.az</span></a>
            <p>Təkər, akkumulyator, disk, yağ və servis xidmətləri — fərdi sürücülər və korporativ avtoparklar üçün bir platformada.</p>
            <div class="footer-social">
              <button type="button" aria-label="Instagram" data-social>${TP.icon("instagram", 18)}</button>
              <button type="button" aria-label="Facebook" data-social>${TP.icon("facebook", 18)}</button>
              <button type="button" aria-label="YouTube" data-social>${TP.icon("youtube", 18)}</button>
              <button type="button" aria-label="WhatsApp" data-social>${TP.icon("whatsapp", 18)}</button>
            </div>
          </div>
          <div class="footer-col"><h2>Naviqasiya</h2><ul>
            <li><a href="#" data-info="about">Haqqımızda</a></li>
            <li><a href="index.html#brands">Brendlər</a></li>
            <li><a href="index.html#blog">Bloq</a></li>
            <li><a href="index.html#video">Video</a></li>
            <li><a href="#" data-info="support">Dəstək</a></li>
            <li><a href="#" data-info="delivery">Çatdırılma və ödəniş</a></li>
            <li><a href="#" data-info="warranty">Zəmanət və qaytarma</a></li>
          </ul></div>
          <div class="footer-col"><h2>Kateqoriyalar</h2><ul>${cats}</ul></div>
          <div class="footer-col"><h2>Ünvan və əlaqə</h2><ul class="footer-contact">
            <li>${TP.icon("pin", 16)}<span>Ünvan təsdiqlənəcək</span></li>
            <li>${TP.icon("phone", 16)}<span>Telefon təsdiqlənəcək</span></li>
            <li>${TP.icon("mail", 16)}<span>E-mail təsdiqlənəcək</span></li>
            <li>${TP.icon("clock", 16)}<span>İş saatları təsdiqlənəcək</span></li>
            <li><a href="branches.html">Bütün filiallar →</a></li>
          </ul></div>
          <div class="footer-col footer-callback">
            <h2>Zəng sifariş et</h2>
            <p>Nömrənizi yazın, məsləhətçi sizə zəng etsin.</p>
            <form class="callback" data-callback novalidate>
              <div class="field">
                <label class="sr-only" for="cb-phone">Telefon nömrəsi</label>
                <div class="callback__row"><span class="callback__prefix">+994</span><input class="input" id="cb-phone" name="phone" type="tel" inputmode="tel" placeholder="50 123 45 67" required data-validate="local-phone" autocomplete="tel-national"></div>
              </div>
              <button type="submit" class="btn btn--primary btn--block">${TP.icon("phone", 16)}Zəng sifariş et</button>
            </form>
          </div>
        </div>
        <div class="container footer-cats"><ul aria-label="Alt kateqoriyalar">${subLinks}</ul></div>
        <div class="container footer-bottom">
          <span>© ${new Date().getFullYear()} Zapçast.az · Bütün hüquqlar qorunur · Frontend prototipi</span>
          <ul class="pay-list" aria-label="Ödəniş üsulları (demo)"><li>Visa</li><li>Mastercard</li><li>Taksit kartları</li><li>Nağd</li></ul>
        </div>
      </footer>
      <button type="button" class="back-to-top" aria-label="Səhifənin yuxarısına qayıt" data-back-to-top>${TP.icon("arrow-up", 20)}</button>`;
  }

  function creditModal() {
    const form = document.createElement("form");
    form.className = "stack";
    form.innerHTML = `
      <p class="muted">Məhsulu hissə-hissə ödəmək üçün müraciət edin. Şərtləri bank tərəfdaşı ilə dəqiqləşdirəcəyik.</p>
      <div class="form-grid">
        <div class="field span-2"><label for="cr-name">Ad və soyad<span class="req">*</span></label><input class="input" id="cr-name" name="name" required minlength="3" autocomplete="name"></div>
        <div class="field"><label for="cr-phone">Telefon<span class="req">*</span></label><input class="input" id="cr-phone" name="phone" type="tel" required placeholder="+994 50 123 45 67" autocomplete="tel"></div>
        <div class="field"><label for="cr-term">Müddət<span class="req">*</span></label><select class="select" id="cr-term" name="term" required><option value="">Seçin</option><option>3 ay</option><option>6 ay</option><option>12 ay</option><option>18 ay</option></select></div>
        <div class="field span-2"><label for="cr-product">Məhsul və ya məbləğ <span class="opt">(istəyə bağlı)</span></label><input class="input" id="cr-product" name="product" placeholder="Məs. 4 ədəd 205/55 R16 qış təkəri"></div>
      </div>
      <label class="check"><input type="checkbox" name="consent" required>Məlumatlarımın müraciətə baxılması üçün istifadəsinə razıyam</label>
      <button type="submit" class="btn btn--primary btn--lg">Müraciəti göndər</button>
      <div class="notice notice--demo">${TP.icon("info", 18)}<span>Demo: müraciət heç yerə göndərilmir, kredit şərtləri nümunə deyil.</span></div>`;
    const m = TP.modal({ title: "Kredit müraciəti", content: form });
    TP.forms.bind(form, { onSuccess: () => { m.close(); TP.toast({ title: "Müraciət yoxlanıldı", text: "Demo rejim: real inteqrasiyada menecer sizinlə əlaqə saxlayacaq." }); } });
  }

  const INFO = {
    about: { title: "Şirkət haqqında", html: `<div class="prose"><p>Zapçast.az fərdi sürücülər və korporativ müştərilər üçün avtomobil məhsulları və servis platformasıdır: təkərlər, akkumulyatorlar, disklər, mühərrik yağları, ehtiyat hissələri və filiallarda servis xidmətləri.</p><p>Bu səhifə frontend prototipidir. Şirkət haqqında rəsmi məlumat backend və kontent inteqrasiyası zamanı əlavə olunacaq.</p></div>` },
    delivery: { title: "Çatdırılma və ödəniş", html: `<div class="prose"><h3>Çatdırılma</h3><ul><li>Ünvan üzrə çatdırılma: demo tarif 10 ₼, 300 ₼-dan yuxarı sifarişlərdə pulsuz.</li><li>Filialdan götürmə: pulsuz, məhsul hazır olanda bildiriş göndərilir.</li></ul><h3>Ödəniş</h3><ul><li>Bank kartı, nağd və taksit seçimləri — yalnız interfeys nümunəsi.</li><li>Prototipdə real ödəniş aparılmır.</li></ul><div class="notice notice--demo">${TP.icon("info", 18)}<span>Tariflər və qaydalar nümunədir, real şərtlər təsdiqləndikdən sonra yenilənəcək.</span></div></div>` },
    warranty: { title: "Zəmanət və qaytarma", html: `<div class="prose"><p>Hər məhsul kartında həmin məhsulun zəmanət şərti göstərilir. Prototipdə göstərilən müddətlər nümunədir.</p><ul><li>Zəmanət müraciəti üçün sifariş nömrəsi və məhsul lazımdır.</li><li>Quraşdırılmamış məhsulun qaytarılması şərtləri real qaydalar təsdiqləndikdən sonra əlavə olunacaq.</li></ul></div>` },
    support: { title: "Dəstək və əlaqə", html: `<div class="stack"><div class="notice notice--demo">${TP.icon("info", 18)}<span>Real telefon və e-mail layihəyə əlavə olunmayıb, ona görə burada uydurma əlaqə məlumatı göstərilmir.</span></div><ul class="branch-info"><li>${TP.icon("phone", 16)}<span>Qaynar xətt: <b class="mono">təsdiqlənəcək</b></span></li><li>${TP.icon("mail", 16)}<span>E-mail: <b class="mono">təsdiqlənəcək</b></span></li><li>${TP.icon("clock", 16)}<span>İş saatları: B.e.–Şənbə (demo)</span></li></ul><a class="btn btn--primary" href="branches.html">Filiallara bax</a></div>` },
  };

  function accountModal() {
    const form = document.createElement("form");
    form.className = "stack";
    form.noValidate = true;
    form.innerHTML = `
      <p class="muted">Sifarişlərinizi və servis rezervasiyalarınızı izləmək üçün daxil olun.</p>
      <div class="field"><label for="acc-email">E-mail və ya telefon<span class="req">*</span></label>
        <input class="input" id="acc-email" name="login" required data-validate="login" autocomplete="username" autofocus></div>
      <div class="field"><label for="acc-pass">Şifrə<span class="req">*</span></label>
        <input class="input" id="acc-pass" name="password" type="password" required minlength="6" autocomplete="current-password"></div>
      <button class="btn btn--primary btn--block btn--lg" type="submit">Daxil ol</button>
      <div class="notice notice--demo">${TP.icon("info", 18)}<span>Demo: hesab sistemi backend inteqrasiyasından sonra işləyəcək. Məlumatlar heç yerə göndərilmir.</span></div>`;
    const m = TP.modal({ title: "Hesaba daxil ol", content: form });
    TP.forms.bind(form, {
      onSuccess: () => { m.close(); TP.toast({ type: "info", title: "Demo rejim", text: "Giriş formu yoxlandı. Hesab funksiyası prototipdə aktiv deyil." }); },
    });
  }

  /* ---------------- Init ---------------- */
  TP.initLayout = function (page) {
    const headHost = TP.$("[data-component='header']");
    if (headHost) headHost.replaceWith(TP.html(headerMarkup(page)));
    const footHost = TP.$("[data-component='footer']");
    if (footHost) footHost.replaceWith(TP.html(footerMarkup()));
    document.body.appendChild(TP.html(drawersMarkup(page)));

    const header = TP.$("#site-header");
    if (header) {
      wireSearch(header.querySelector(".header-search"));
      const qParam = TP.params().get("q");
      if (qParam) header.querySelector(".search__input").value = qParam;

      const toggle = header.querySelector("[data-toggle-search]");
      toggle.addEventListener("click", () => {
        const open = header.classList.toggle("search-open");
        toggle.setAttribute("aria-expanded", String(open));
        if (open) header.querySelector(".search__input").focus();
      });

      // Mega menus (one open at a time; Esc / outside click closes)
      const ddButtons = TP.$$("[data-dropdown]", header);
      const panelOf = (btn) => TP.$("#" + btn.getAttribute("aria-controls"), header);
      const closeAll = (except) => ddButtons.forEach((b) => { if (b !== except) { b.setAttribute("aria-expanded", "false"); panelOf(b).hidden = true; } });
      ddButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const panel = panelOf(btn);
          const open = panel.hidden;
          closeAll(btn);
          panel.hidden = !open;
          btn.setAttribute("aria-expanded", String(open));
        });
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown--mega") && !e.target.closest(".mega")) closeAll();
      });
      header.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const openBtn = ddButtons.find((b) => b.getAttribute("aria-expanded") === "true");
        if (openBtn) { closeAll(); openBtn.focus(); }
      });
    }

    // Language switch (only Azerbaijani exists in the prototype)
    TP.$$("[data-lang]").forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.lang === "az") return;
      TP.toast({ type: "info", title: b.dataset.lang === "en" ? "English version" : "Русская версия", text: "Bu dil versiyası prototipdə hələ hazırlanmayıb." });
    }));

    // Footer call-back form
    const cb = TP.$("[data-callback]");
    if (cb) TP.forms.bind(cb, { reset: true, onSuccess: () => TP.toast({ title: "Zəng sifarişi yoxlanıldı", text: "Demo rejim: nömrə heç yerə göndərilmir." }) });

    const menuRoot = TP.$("#mobile-nav");
    const burger = TP.$("[data-open-menu]");
    const menu = TP.drawer(menuRoot, { onClose: () => burger && burger.setAttribute("aria-expanded", "false") });
    if (burger) burger.addEventListener("click", () => { burger.setAttribute("aria-expanded", "true"); menu.open(burger); });

    const cartDrawer = TP.drawer(TP.$("#cart-drawer"));
    TP.openCartDrawer = (trigger) => { renderCartDrawer(); cartDrawer.open(trigger); };
    TP.$$("[data-open-cart]").forEach((b) => b.addEventListener("click", () => TP.openCartDrawer(b)));
    TP.$("#cart-drawer").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove]");
      if (rm) TP.cart.remove(rm.dataset.remove);
    });

    document.addEventListener("click", (e) => {
      const info = e.target.closest("[data-info]");
      if (info) { e.preventDefault(); const c = INFO[info.dataset.info]; if (c) TP.modal({ title: c.title, content: c.html }); return; }
      if (e.target.closest("[data-open-account]")) { e.preventDefault(); if (menu.isOpen()) menu.close(); accountModal(); return; }
      if (e.target.closest("[data-credit]")) { e.preventDefault(); if (menu.isOpen()) menu.close(); creditModal(); return; }
      if (e.target.closest("[data-social]")) TP.toast({ type: "info", title: "Sosial şəbəkə linkləri", text: "Rəsmi hesablar təsdiqləndikdən sonra əlavə olunacaq." });
    });

    TP.on("tp:cart", () => { updateCounts(); if (!TP.$("#cart-drawer").hidden) renderCartDrawer(); });
    TP.on("tp:fav", updateCounts);
    updateCounts();

    // Back to top
    const btt = TP.$("[data-back-to-top]");
    if (btt) {
      const onScroll = () => btt.classList.toggle("is-visible", window.scrollY > 600);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      btt.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const main = TP.$("#main");
        if (main) main.focus({ preventScroll: true });
      });
    }
  };
})();
