/*
  Shared behaviour for the Okojie mockups.

  - Injects the icon sprite (use <svg class="i"><use href="#i-name"/></svg>).
  - Builds the sidebar + mobile top bar for <body data-area="portal|admin" data-active="...">.
  - Theme toggle for any .theme-btn (saved in localStorage, same key as the homepage).
  - The dark "Mockup states" panel: a data/empty switch for pages with [data-when]
    elements, plus any extra controls a page registers in window.MOCK_CONTROLS.
  - Okojie.toast(text) and copy buttons ([data-copy]).
*/
(function () {
  var ICONS = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
    doc: '<path d="M14 3.5H7.5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V8z"/><path d="M14 3.5V8h4.5M9 13h6M9 16.5h4"/>',
    cal: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3v4M15.5 3v4"/>',
    msg: '<path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4.5 3.5v-3.5a2 2 0 0 1-1-1.7z"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M3.5 9h17M12 9v11M12 9S10.5 4.5 8 4.5a2 2 0 0 0 0 4.5M12 9s1.5-4.5 4-4.5a2 2 0 0 1 0 4.5"/>',
    shield: '<path d="M12 3l7.5 3v5.5c0 4.5-3.2 8.3-7.5 9.5-4.3-1.2-7.5-5-7.5-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    pen: '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 3L8 18.5z"/><path d="M13.5 7l3 3"/>',
    upload: '<path d="M12 15V4.5M7.5 9L12 4.5 16.5 9"/><path d="M4.5 15v2.5A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    download: '<path d="M12 4.5V15M7.5 10.5L12 15l4.5-4.5"/><path d="M4.5 15v2.5A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5V15"/>',
    card: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M3.5 10h17M7 14.5h3"/>',
    phone: '<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A17 17 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z"/>',
    video: '<rect x="3.5" y="6.5" width="12" height="11" rx="2.5"/><path d="M15.5 10.5l5-3v9l-5-3"/>',
    building: '<path d="M4.5 20.5V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14.5 9.5h4a1 1 0 0 1 1 1v10M3 20.5h18M8 8h3M8 11.5h3M8 15h3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    logout: '<path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14M10 16l-4-4 4-4M6 12h10"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/>',
    monitor: '<rect x="3.5" y="4.5" width="17" height="12" rx="2"/><path d="M8.5 20h7M12 16.5V20"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    send: '<path d="M20.5 3.5L10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4z"/>',
    receipt: '<path d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z"/><path d="M9 8.5h6M9 12h6"/>',
    hourglass: '<path d="M7 3.5h10M7 20.5h10M8 3.5c0 4 4 5.5 4 8.5s-4 4.5-4 8.5M16 3.5c0 4-4 5.5-4 8.5s4 4.5 4 8.5"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeoff: '<path d="M4 4l16 16M10.6 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.6M6.6 6.9C3.9 8.7 2.5 12 2.5 12S6 18.5 12 18.5c1.5 0 2.9-.4 4.1-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.5"/><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>',
    users: '<circle cx="9" cy="8.5" r="3.5"/><path d="M3 19.5a6 6 0 0 1 12 0M15.5 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14a6 6 0 0 1 3.5 5.5"/>',
    user: '<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
    inbox: '<path d="M3.5 13.5l2.6-7.2A2 2 0 0 1 8 5h8a2 2 0 0 1 1.9 1.3l2.6 7.2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/><path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    filter: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    dots: '<circle cx="12" cy="6" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="12" cy="18" r="1.2"/>',
    alert: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    printer: '<path d="M7 9V3.5h10V9M7 17.5H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9.5h14a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-2"/><path d="M7 14h10v6.5H7z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.3 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.3-3.5-8.5s1-5.9 3.5-8.5z"/>',
    spark: '<path d="M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z"/>',
    funnel: '<path d="M4 5h16l-6 7.5V19l-4 1.5v-8z"/>',
    swap: '<path d="M7 7h12l-3-3M17 17H5l3 3"/>',
    bars: '<path d="M5 20V12M10 20V6M15 20v-9M20 20V9"/>',
    note: '<path d="M5.5 4.5h13v15h-13z"/><path d="M8.5 9h7M8.5 12.5h7M8.5 16h4"/>',
    ban: '<circle cx="12" cy="12" r="8.5"/><path d="M6 6l12 12"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3L19.5 9M19.5 4v5h-5"/>',
    qr: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14v2"/>'
  };

  function sprite() {
    var s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true">';
    for (var k in ICONS) s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    return s + '</svg>';
  }
  function ic(name, cls) { return '<svg class="i' + (cls ? ' ' + cls : '') + '"><use href="#i-' + name + '"/></svg>'; }

  var NAV = {
    portal: {
      home: 'portal-overview.html', mark: 'O', name: 'Okojie Online', sub: 'Client portal',
      groups: [
        { label: 'Your return', items: [
          ['overview', 'Overview', 'grid', 'portal-overview.html'],
          ['documents', 'Documents', 'doc', 'portal-documents.html', '4', true],
          ['appointments', 'Appointments', 'cal', 'portal-appointments.html'],
          ['messages', 'Messages', 'msg', 'portal-messages.html', '1']
        ]},
        { label: 'Account', items: [
          ['referrals', 'Referrals', 'gift', 'portal-referrals.html'],
          ['security', 'Security & 2FA', 'shield', 'portal-security.html']
        ]}
      ],
      help: '<div class="help"><b>Questions about your return?</b><p>Book a call or ring the office.</p>' +
            '<a href="portal-messages.html">' + ic('msg', 'i-sm') + 'Open messages</a>' +
            '<a href="tel:+12155550142" class="num">' + ic('phone', 'i-sm') + '(215) 555-0142</a></div>',
      profile: ['DR', 'Denise Robinson', 'Hybrid · denise.r@example.com', '']
    },
    admin: {
      home: 'admin-clients.html', mark: 'O', name: 'Okojie Staff', sub: 'Admin', dark: true,
      groups: [
        { label: 'Workspace', items: [
          ['clients', 'Clients', 'users', 'admin-clients.html', '128', true],
          ['leads', 'Leads', 'inbox', 'admin-leads.html', '6'],
          ['referrals', 'Referrals', 'gift', 'admin-referrals.html']
        ]},
        { label: 'Account', items: [
          ['settings', 'Settings', 'sliders', 'settings-profile.html']
        ]}
      ],
      help: '',
      profile: ['AO', 'Adaeze Okojie', 'Preparer · Germantown Ave', 'av-2']
    }
  };

  function buildShell() {
    var body = document.body, area = body.dataset.area, active = body.dataset.active;
    var cfg = NAV[area];
    if (!cfg) return;
    var main = document.getElementById('main');
    var app = document.createElement('div');
    app.className = 'app'; app.id = 'app';

    var html = '<aside class="sidebar" id="sidebar" aria-label="' + cfg.name + '">' +
      '<a href="' + cfg.home + '" class="ws"><span class="ws-mark' + (cfg.dark ? ' dark' : '') + '" aria-hidden="true">' + cfg.mark + '</span><span><b>' + cfg.name + '</b><small>' + cfg.sub + '</small></span></a>' +
      '<nav aria-label="' + cfg.sub + ' navigation">';
    cfg.groups.forEach(function (g) {
      html += '<div class="nav-group"><span class="eyebrow nav-label">' + g.label + '</span>';
      g.items.forEach(function (it) {
        var cur = it[0] === active ? ' aria-current="page"' : '';
        var count = it[4] ? '<span data-when="data" class="count num' + (it[5] ? ' muted' : '') + '">' + it[4] + '</span>' : '';
        html += '<a class="nav-item" href="' + it[3] + '"' + cur + '>' + ic(it[2]) + it[1] + count + '</a>';
      });
      html += '</div>';
    });
    html += '</nav><div class="side-foot">' + cfg.help +
      '<div class="profile"><span class="avatar ' + cfg.profile[3] + '" aria-hidden="true">' + cfg.profile[0] + '</span>' +
      '<span class="who"><b>' + cfg.profile[1] + '</b><small>' + cfg.profile[2] + '</small></span>' +
      '<a class="icon-btn" href="auth-login.html" aria-label="Log out">' + ic('logout', 'i-sm') + '</a></div></div></aside>' +
      '<div class="scrim" id="scrim"></div>';
    app.innerHTML = html;

    var wrap = document.createElement('div');
    wrap.className = 'main-wrap';
    wrap.innerHTML = '<div class="topbar-mobile">' +
      '<button class="icon-btn" id="menu-btn" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">' + ic('menu') + '</button>' +
      '<a href="' + cfg.home + '" class="ws"><span class="ws-mark' + (cfg.dark ? ' dark' : '') + '" aria-hidden="true">' + cfg.mark + '</span><span><b>' + cfg.name + '</b></span></a>' +
      themeBtn() + '</div>';
    main.parentNode.insertBefore(app, main);
    wrap.appendChild(main);
    app.appendChild(wrap);

    var btn = document.getElementById('menu-btn'), scrim = document.getElementById('scrim');
    function set(open) { app.classList.toggle('nav-open', open); btn.setAttribute('aria-expanded', open); }
    btn.addEventListener('click', function () { set(!app.classList.contains('nav-open')); });
    scrim.addEventListener('click', function () { set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  }

  // Public site: nav inside the .band header, footer after <main>
  function buildSite() {
    if (document.body.dataset.area !== 'site') return;
    var active = document.body.dataset.active;
    var links = [['home', 'Home', 'home.html'], ['services', 'Services', 'services.html'], ['pricing', 'Pricing', 'pricing.html'], ['about', 'About', 'about.html'], ['contact', 'Contact', 'contact.html']];
    var nav = '<nav class="snav" aria-label="Primary">' +
      '<a href="home.html" class="ws"><span class="ws-mark" aria-hidden="true">O</span><span><b>Okojie &amp; Associates</b><small>Okojie Online</small></span></a>' +
      '<div class="snav-links">' + links.map(function (l) { return '<a href="' + l[2] + '"' + (l[0] === active ? ' aria-current="page"' : '') + '>' + l[1] + '</a>'; }).join('') + '</div>' +
      '<div class="snav-actions">' + themeBtn() +
      '<a href="auth-login.html" class="btn btn-secondary hide-m">Client login</a>' +
      '<a href="contact.html#start" class="btn btn-primary hide-m">Start my return</a>' +
      '<details class="menu" style="position:relative"><summary class="icon-btn" aria-label="Menu" style="list-style:none">' + ic('menu') + '</summary>' +
      '<div style="position:absolute;right:0;top:48px;z-index:20;width:220px;padding:6px;border-radius:14px;background:var(--color-surface);box-shadow:var(--shadow-raised);display:grid">' +
      links.map(function (l) { return '<a class="nav-item" href="' + l[2] + '"' + (l[0] === active ? ' aria-current="page"' : '') + '>' + l[1] + '</a>'; }).join('') +
      '<a class="nav-item" href="auth-login.html">Client login</a><a class="btn btn-primary" style="margin-top:6px" href="contact.html#start">Start my return</a></div></details>' +
      '</div></nav>';
    var band = document.querySelector('.band');
    if (band) band.insertAdjacentHTML('afterbegin', nav);
    var foot = '<footer class="sfoot"><div class="sfoot-grid">' +
      '<div><a href="home.html" class="ws" style="padding:0"><span class="ws-mark" aria-hidden="true">O</span><span><b>Okojie &amp; Associates, Inc.</b><small>Okojie Online</small></span></a>' +
      '<p>Online filing with a real tax professional who knows Philadelphia and Baltimore. Serving individuals, families and small businesses for 26+ years.</p></div>' +
      '<div><h4>Explore</h4><ul>' + links.map(function (l) { return '<li><a href="' + l[2] + '">' + l[1] + '</a></li>'; }).join('') + '<li><a href="auth-login.html">Client login</a></li></ul></div>' +
      '<div><h4>Get in touch</h4><ul><li><a class="num" href="tel:+12155550142">(215) 555-0142</a></li><li><a href="mailto:hello@okojieonline.com">hello@okojieonline.com</a></li><li><a href="contact.html#start">Book a consultation</a></li></ul></div>' +
      '<div><h4>Offices</h4><ul><li>5601 Germantown Ave<small>Philadelphia, PA</small></li><li>2301 N. Broad St<small>Philadelphia, PA</small></li><li>6300 W. Chelten Ave<small>Philadelphia, PA</small></li><li>4100 Liberty Heights Ave<small>Baltimore, MD</small></li></ul></div>' +
      '</div><div class="sfoot-bottom"><span>© 2026 Okojie &amp; Associates, Inc.</span><span>' + ic('shield', 'i-sm') + 'IRS Publication 4557 &amp; FTC Safeguards compliant</span>' +
      '<nav aria-label="Legal"><a href="legal-privacy.html">Privacy policy</a><a href="legal-terms.html">Terms of service</a><a href="legal-security.html">Security (WISP)</a></nav></div></footer>';
    if (!document.body.hasAttribute('data-no-footer')) document.getElementById('main').insertAdjacentHTML('afterend', foot);
  }

  function themeBtn() {
    return '<button class="icon-btn theme-btn" type="button" aria-label="Switch theme">' + ic('moon', 'ico ico-moon') + ic('sun', 'ico ico-sun') + '</button>';
  }

  function bindTheme() {
    var root = document.documentElement;
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.theme-btn')) return;
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-switching');
      root.dataset.theme = next;
      try { localStorage.setItem('okojie-theme', next); } catch (err) {}
      requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.remove('theme-switching'); }); });
    });
  }

  // URL options for reviewing: ?theme=dark&m0=empty&m1=2&panel=hide
  var PARAMS = new URLSearchParams(location.search);
  if (PARAMS.get('theme') === 'dark' || PARAMS.get('theme') === 'light') document.documentElement.dataset.theme = PARAMS.get('theme');

  function mockPanel() {
    var controls = (window.MOCK_CONTROLS || []).slice();
    if (document.querySelector('#main [data-when]')) {
      controls.unshift({ label: 'Content', options: [['data', 'With data'], ['empty', 'Empty']], value: 'data',
        onChange: function (v) { document.body.dataset.view = v; } });
    }
    if (!controls.length) return;
    if (!document.body.dataset.view) document.body.dataset.view = 'data';
    var p = document.createElement('div');
    p.className = 'mock-panel'; p.id = 'mock-panel';
    p.setAttribute('aria-label', 'Mockup controls');
    var h = '<div class="mp-title"><span>Mockup states</span><button class="mp-hide" type="button">Hide</button></div>';
    controls.forEach(function (c, i) {
      h += '<label>' + c.label + '<select data-i="' + i + '">';
      var v = PARAMS.get('m' + i) || c.value;
      c.options.forEach(function (o) { h += '<option value="' + o[0] + '"' + (o[0] === v ? ' selected' : '') + '>' + o[1] + '</option>'; });
      h += '</select></label>';
    });
    p.innerHTML = h;
    document.body.appendChild(p);
    p.querySelectorAll('select').forEach(function (s) {
      var c = controls[+s.dataset.i];
      s.addEventListener('change', function () { c.onChange(s.value); });
      c.onChange(s.value);
    });
    var hide = p.querySelector('.mp-hide');
    function collapse(c) { p.classList.toggle('collapsed', c); hide.textContent = c ? 'Show' : 'Hide'; }
    hide.addEventListener('click', function () { collapse(!p.classList.contains('collapsed')); });
    if (matchMedia('(max-width: 720px)').matches) collapse(true);
    if (PARAMS.get('panel') === 'hide') p.hidden = true;
  }

  var toastTimer;
  function toast(text) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); t.hidden = true;
      document.body.appendChild(t);
    }
    t.innerHTML = ic('check', 'i-sm') + '<span></span>';
    t.lastChild.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2200);
  }

  function bindCopy() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var done = function () { toast(b.dataset.copyToast || 'Copied'); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done, done); else done();
    });
  }

  // Prevent mockup links/forms from navigating to "#"
  function bindInert() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href="#"]');
      if (a) e.preventDefault();
    });
    document.addEventListener('submit', function (e) {
      var f = e.target;
      if (f.dataset.toast) { e.preventDefault(); toast(f.dataset.toast); }
    });
  }

  document.body.insertAdjacentHTML('afterbegin', sprite());
  window.Okojie = { ic: ic, toast: toast, themeBtn: themeBtn };

  function init() {
    buildShell();
    buildSite();
    bindTheme();
    bindCopy();
    bindInert();
    mockPanel();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
