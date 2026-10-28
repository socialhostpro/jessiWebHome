<script>
(function () {
  var form = document.getElementById('cform'), status = document.getElementById('cstatus');
  var send = document.getElementById('csend'), done = document.getElementById('cdone');
  var msg = form.elements.message, count = document.getElementById('ccount');
  document.getElementById('ct').value = String(Date.now());

  function showDone(email) {
    document.querySelector('.cwrap').hidden = true;
    if (email) document.getElementById('cdone-email').textContent = email;
    done.hidden = false;
    done.scrollIntoView({ block: 'center' });
  }
  var q = new URLSearchParams(location.search);
  if (q.get('sent') === '1') showDone('');
  if (q.get('error')) status.textContent = q.get('error');

  msg.addEventListener('input', function () { count.textContent = msg.value.length + ' / 5000'; });

  function check() {
    var ok = true;
    [['name', function (v) { return v.trim().length > 0; }],
     ['email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }],
     ['message', function (v) { return v.trim().length >= 10; }]].forEach(function (c) {
      var el = form.elements[c[0]], good = c[1](el.value);
      el.closest('.f').classList.toggle('bad', !good);
      if (!good) ok = false;
    });
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    if (!check()) { status.textContent = 'Please add your name, a valid email and a message of at least 10 characters.'; return; }
    send.disabled = true;
    send.querySelector('.lbl').textContent = 'SENDING';
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }).then(function (j) { return { r: r, j: j }; }); })
      .then(function (x) {
        if (x.r.ok && x.j.ok) { showDone(data.email.trim()); return; }
        throw new Error(x.j.error || 'Something went wrong. Please try again.');
      })
      .catch(function (err) {
        status.textContent = (err && err.message && !/fetch/i.test(err.message)) ? err.message : 'Could not send. Check your connection and try again, or email {{EMAIL}}.';
        send.disabled = false;
        send.querySelector('.lbl').textContent = 'SEND MESSAGE';
      });
  });
})();
</script>
