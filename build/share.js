  <script>
  // Share widget: native share sheet on touch devices, panel everywhere else.
  (function () {
    var TITLE = 'Jessi AI — No data center needed';
    var TEXT = 'Jessi is an on-device AI assistant that thinks on your phone, not in a data center.';
    function root() { return document.documentElement; }
    function home() { var c = document.querySelector('link[rel="canonical"]'); return c ? c.href : location.origin + '/'; }
    // Share the section you're looking at (e.g. /glasses), on the site's public address.
    function url() { return window.jxRoute ? home().replace(/\/$/, '') + window.jxRoute.url().slice(location.origin.length) : home(); }
    function retarget() {
      var from = encodeURIComponent(home()), to = encodeURIComponent(url());
      [].forEach.call(document.querySelectorAll('[data-jx-share] a.jx-sh'), function (a) {
        var base = a.getAttribute('data-href') || a.getAttribute('href');
        a.setAttribute('data-href', base);
        a.setAttribute('href', base.split(from).join(to));
      });
      var shown = document.querySelector('.jx-share-url');
      if (shown) shown.textContent = url().replace(/^https?:\/\//, '');
    }
    function setOpen(open) {
      if (open) retarget();
      root().classList.toggle('jx-share-open', open);
      var b = document.querySelector('[data-jx-share-btn]');
      if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    function nativeShare() {
      return navigator.share({ title: TITLE, text: TEXT, url: url() }).then(function () { return true; }, function (e) { return e && e.name === 'AbortError'; });
    }
    if (navigator.share) root().classList.add('jx-can-share');
    var coarse = window.matchMedia('(pointer: coarse)');
    window.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      if (t.closest('[data-jx-share-btn]')) {
        if (navigator.share && coarse.matches && !root().classList.contains('jx-share-open')) {
          nativeShare().then(function (done) { if (!done) setOpen(true); });
        } else {
          setOpen(!root().classList.contains('jx-share-open'));
        }
        return;
      }
      if (t.closest('[data-jx-native]')) { nativeShare(); return; }
      if (t.closest('[data-jx-copy]')) {
        var done = function () { root().classList.add('jx-copied'); setTimeout(function () { root().classList.remove('jx-copied'); }, 2000); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url()).then(done, function () { window.prompt('Copy this link:', url()); });
        else window.prompt('Copy this link:', url());
        return;
      }
      var pop = t.closest('[data-jx-pop]');
      if (pop) {
        var w = window.open(pop.href, 'jx-share', 'width=620,height=640');
        if (w) { w.opener = null; e.preventDefault(); }
        return;
      }
      if (!t.closest('[data-jx-share]')) setOpen(false);
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  })();

  // Join beta / waitlist modal. Every "#beta" link opens it; without scripts they still scroll to the beta section.
  (function () {
    var lastFocus = null, startedAt = 0;
    function root() { return document.documentElement; }
    function q(s) { return document.querySelector(s); }
    function setOpen(open, platform) {
      var r = root();
      r.classList.toggle('jx-wl-open', open);
      if (open) {
        r.classList.remove('jx-pm-open', 'jx-share-open', 'jx-menu-open');
        r.classList.remove('jx-wl-sent');
        lastFocus = document.activeElement;
        startedAt = Date.now();
        if (platform) { var radio = q('[data-jx-wl-form] input[name="platform"][value="' + platform + '"]'); if (radio) radio.checked = true; }
        setTimeout(function () { var e = q('[data-jx-wl-form] input[name="email"]'); if (e) e.focus({ preventScroll: true }); }, 80);
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus({ preventScroll: true });
      }
      if (window.jxRoute) window.jxRoute.modal('join', open);
    }
    window.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      var trig = t.closest('a[href="#beta"], [data-jx-wl]');
      if (trig && !t.closest('[data-jx-wl-modal]')) {
        e.preventDefault();
        var p = trig.getAttribute('data-jx-wl');
        setOpen(true, p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : null);
        return;
      }
      if (t.closest('[data-jx-wl-close]')) { e.preventDefault(); setOpen(false); }
    }, true);
    window.addEventListener('keydown', function (e) {
      if (!root().classList.contains('jx-wl-open')) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab') {
        var card = q('.jx-wl-card');
        var f = card ? [].filter.call(card.querySelectorAll('a[href], button, input:not([tabindex="-1"])'), function (el) { return el.offsetParent !== null; }) : [];
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('submit', function (e) {
      var form = e.target && e.target.closest && e.target.closest('[data-jx-wl-form]');
      if (!form) return;
      e.preventDefault();
      var status = q('[data-jx-wl-status]'), btn = form.querySelector('.jx-wl-send'), lbl = btn.querySelector('.jx-wl-lbl');
      var email = form.elements.email, emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      email.closest('.jx-wl-f').classList.toggle('bad', !emailOk);
      status.textContent = '';
      if (!emailOk) { status.textContent = 'Please enter a valid email address.'; email.focus(); return; }
      var uses = [].map.call(form.querySelectorAll('input[name="uses"]:checked'), function (c) { return c.value; });
      var platform = form.querySelector('input[name="platform"]:checked');
      var data = {
        name: form.elements.name.value, email: email.value, device: form.elements.device.value,
        platform: platform ? platform.value : 'Android', uses: uses,
        updates: form.elements.updates.checked, website: form.elements.website.value, t: startedAt
      };
      btn.disabled = true; lbl.textContent = 'JOINING';
      fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { r: r, j: j }; }); })
        .then(function (x) {
          if (!(x.r.ok && x.j.ok)) throw new Error(x.j.error || 'Something went wrong. Please try again.');
          var shown = q('[data-jx-wl-email]'); if (shown) shown.textContent = data.email.trim();
          root().classList.add('jx-wl-sent');
          form.reset();
        })
        .catch(function (err) {
          status.textContent = err && err.message && !/fetch/i.test(err.message) ? err.message : 'Could not connect. Please check your connection and try again.';
        })
        .then(function () { btn.disabled = false; lbl.textContent = 'GET ON THE LIST'; });
    }, true);
  })();

  // Privacy promise modal. The trigger is a real link to /privacy, so it still works without scripts.
  (function () {
    var lastFocus = null;
    function root() { return document.documentElement; }
    function setOpen(open) {
      root().classList.toggle('jx-pm-open', open);
      if (open) {
        lastFocus = document.activeElement;
        setTimeout(function () { var x = document.querySelector('.jx-pm-x'); if (x) x.focus(); }, 50);
      } else if (lastFocus && lastFocus.focus) {
        lastFocus.focus();
      }
      if (window.jxRoute) window.jxRoute.modal('privacy-promise', open);
    }
    window.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target : null;
      if (!t) return;
      if (t.closest('[data-jx-pm-open]')) { e.preventDefault(); setOpen(true); return; }
      if (t.closest('[data-jx-pm-close]')) {
        var a = t.closest('a[href^="#"]');
        if (!a) e.preventDefault();
        setOpen(false);
      }
    });
    window.addEventListener('keydown', function (e) {
      if (!root().classList.contains('jx-pm-open')) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'Tab') {
        var card = document.querySelector('.jx-pm-card');
        var f = card ? card.querySelectorAll('a[href], button') : [];
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  })();
  </script>
