/* Inline stroke icon set (24×24). Usage: TP.icon("cart", 20) */
(function () {
  "use strict";
  const TP = window.TP;
  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
    heart: '<path d="M12 20s-7.5-4.6-9.2-9.3C1.6 7.4 3.8 4 7.2 4c2 0 3.5 1.1 4.8 2.8C13.3 5.1 14.8 4 16.8 4c3.4 0 5.6 3.4 4.4 6.7C19.5 15.4 12 20 12 20Z"/>',
    cart: '<path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17" cy="20.5" r="1.3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-right": '<path d="m9 6 6 6-6 6"/>',
    "chevron-left": '<path d="m15 6-6 6 6 6"/>',
    "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-up": '<path d="M12 19V5M6 11l6-6 6 6"/>',
    phone: '<path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 7 7L16 14l5 2v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
    truck: '<path d="M2 6h11v10H2zM13 9h4l4 4v3h-8"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    shield: '<path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    store: '<path d="M3 9h18l-1.5-5h-15L3 9Zm0 0v11h18V9M9 20v-6h6v6"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5 2.5-2.5Z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    filter: '<path d="M4 5h16l-6 8v5l-4 2v-7L4 5Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
    alert: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17v.5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 2 3-2M9 20l3-2 3 2"/>',
    season: '<circle cx="9" cy="10" r="3.5"/><path d="M9 3v1.5M3.5 10H2M4.8 5.8l1 1M14 6l1-1"/><path d="M13 20h7a3 3 0 0 0 0-6 4.5 4.5 0 0 0-8.5 1.2A2.5 2.5 0 0 0 13 20Z"/>',
    tyre: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1.2"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>',
    battery: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M7 7V4h3v3M14 7V4h3v3M7 13h3M15.5 11.5v3M14 13h3"/>',
    rim: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2"/><path d="M12 10V3.5M13.9 11.4l6.1-2M13.2 13.6l3.8 5.2M10.8 13.6 7 18.8M10.1 11.4 4 9.4"/>',
    oil: '<path d="M7 8h7l2 3v9H6v-9l1-3Z"/><path d="M9 8V5h3v3M16 11l4-3M11 14.5c0 1.2-.9 2-2 2"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    balance: '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M8 9h8M7 15h10"/>',
    alignment: '<path d="M6 4v16M18 4v16M6 12h12"/><path d="M3 8l3-4 3 4M15 16l3 4 3-4"/>',
    building: '<path d="M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2M3 21h18"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2 .8 3.5 2.8 3.5 5.7"/>',
    doc: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/>',
    headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/><path d="M19 20c0 1-1.5 2-4 2h-2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
    cash: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 9v.01M18 15v.01"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5v.01"/>',
    facebook: '<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9 5 3-5 3V9Z"/>',
    whatsapp: '<path d="M4 20l1.3-4A8 8 0 1 1 8 19l-4 1Z"/><path d="M9 9.5c.3 2.4 2.2 4.4 4.6 4.8l1-1.2 1.9.8-.3 1.5c-3.6.4-7.6-3.5-7.2-7.1l1.5-.3.8 1.9-1.3.6Z"/>',
    star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.3 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.7l6.2-.9L12 3Z"/>',
    gauge: '<path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 18 4-6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    volume: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
    map: '<path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    car: '<path d="M3 13l2-6a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 7l2 6v5h-2.5M3 13v5h2.5M3 13h18"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="16.5" cy="17.5" r="2"/>',
  };

  TP.icon = (name, size = 20, extraClass = "") =>
    `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${P[name] || P.info}</svg>`;

  TP.logoMark = () =>
    `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="18" fill="#0B1220" stroke="#FF5A1F" stroke-width="2.5"/>
      <g stroke="#FF5A1F" stroke-width="2.4" stroke-linecap="round">
        <path d="M20 4.5v4M20 31.5v4M4.5 20h4M31.5 20h4M9 9l2.8 2.8M28.2 28.2 31 31M9 31l2.8-2.8M28.2 11.8 31 9"/>
      </g>
      <circle cx="20" cy="20" r="8" fill="#F2F5F8"/>
      <path d="M16.5 16.5h7l-7 7h7" fill="none" stroke="#0E1726" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
})();
