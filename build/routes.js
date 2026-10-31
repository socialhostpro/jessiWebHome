  <script>
  // Section URLs: /glasses instead of /#glasses. Paths map to section ids; the server
  // serves the home page for each of them (routes.json), and this keeps the address bar in sync.
  (function () {
    var ROUTES = {{ROUTES_JSON}};
    var MODALS = { join: 'jx-wl-open', 'privacy-promise': 'jx-pm-open' };
    var byId = {};
    Object.keys(ROUTES).forEach(function (p) { byId[ROUTES[p]] = p; });
    var current = '', lockUntil = 0;

    function slug() { return location.pathname.replace(/^\/+|\/+$/g, ''); }
    function setPath(path, push) {
      if (location.pathname === path && !location.hash) return;
      try { history[push ? 'pushState' : 'replaceState'](null, '', path); } catch (e) {}
    }
    function scrollToId(id, smooth) {
      var el = document.getElementById(id);
      if (!el) return false;
      lockUntil = Date.now() + (smooth ? 1200 : 400);
      el.scrollIntoView({ behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto', block: 'start' });
      current = id;
      return true;
    }
    // Wait for the runtime to render the section, then scroll; re-scroll once layout settles.
    function arrive(id) {
      var tries = 0;
      (function go() {
        if (scrollToId(id, false)) {
          lockUntil = Date.now() + 1500; // layout is still settling; don't let scroll tracking rename the URL
          setTimeout(function () { scrollToId(id, false); lockUntil = Date.now() + 300; setPath('/' + byId[id], false); }, 900);
          return;
        }
        if (++tries < 80) setTimeout(go, 50);
      })();
    }
    function openModal(name) {
      var tries = 0;
      (function go() {
        var trig = name === 'join' ? document.querySelector('a[href="#beta"]') : document.querySelector('[data-jx-pm-open]');
        if (trig) { trig.click(); return; }
        if (++tries < 80) setTimeout(go, 50);
      })();
    }

    window.jxRoute = {
      // Called by the modals so /join and /privacy-promise reflect what's open.
      modal: function (name, open) {
        if (!open && /jx-(wl|pm)-open/.test(document.documentElement.className)) return; // another modal took over
        setPath(open ? '/' + name : (current && byId[current] ? '/' + byId[current] : '/'), false); },
      url: function () { return location.origin + (byId[current] ? '/' + byId[current] : '/'); }
    };

    // Entry: legacy /#section links, pretty paths, and modal paths.
    var h = location.hash.slice(1);
    if (h && byId[h]) { setPath('/' + byId[h], false); arrive(h); }
    else if (ROUTES[slug()]) arrive(ROUTES[slug()]);
    else if (MODALS[slug()]) openModal(slug());

    // In-page links to pretty paths scroll instead of reloading.
    window.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a || a.target) return;
      var href = a.getAttribute('href');
      var s = href.replace(/^\/+|\/+$/g, '');
      if (href === '/') { e.preventDefault(); lockUntil = Date.now() + 1200; window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); current = ''; setPath('/', true); return; }
      if (href.charAt(0) !== '/' || !ROUTES[s]) return;
      e.preventDefault();
      if (scrollToId(ROUTES[s], true)) setPath('/' + s, true);
    });

    // Back / forward between sections.
    window.addEventListener('popstate', function () {
      var id = ROUTES[slug()];
      if (id) scrollToId(id, true);
      else if (!slug()) { lockUntil = Date.now() + 1200; window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); current = ''; }
    });

    // Scrolling updates the address bar to the section in view (replace, so history isn't flooded).
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        if (Date.now() < lockUntil || MODALS[slug()]) return;
        var r = document.documentElement;
        if (r.classList.contains('jx-wl-open') || r.classList.contains('jx-pm-open')) return;
        var active = '';
        for (var id in byId) {
          var el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140 && el.getBoundingClientRect().bottom > 140) active = id;
        }
        if (active !== current) { current = active; setPath(active ? '/' + byId[active] : '/', false); }
      });
    }, { passive: true });
  })();
  </script>
