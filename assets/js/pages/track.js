/* NEBULA MART — track order page */
(function () {
  'use strict';
  var $ = function (i) { return document.getElementById(i); };
  var form = $('track-form');
  if (!form || !window.RD) return;

  var STEPS = [
    ['Order placed', 'We received your order.'],
    ['Confirmed', 'Your order is confirmed and being packed.'],
    ['Shipped', 'Your package is on the way.'],
    ['Out for delivery', 'Our rider will call you soon.'],
    ['Delivered', 'Package delivered. Enjoy!']
  ];

  function show(raw) {
    var L = RD.last();
    var v = String(raw || '').trim().toUpperCase();
    var ok = (L && L.no === v) || /^RD\d{8,}$/.test(v);
    $('track-result').hidden = !ok;
    $('track-none').hidden = ok;
    if (!ok) return;

    var mine = L && L.no === v;
    var at = mine ? new Date(L.at) : new Date(Date.now() - 36e5 * 30);
    var h = (Date.now() - at) / 36e5;
    var z = mine ? RD.ZONES[L.zone] : RD.ZONES.dhaka;
    var cur = h < 1 ? 0 : h < 6 ? 1 : h < 24 ? 2 : h < 24 * z.days ? 3 : 4;

    $('t-id').textContent = v;
    $('t-eta').textContent = z.label + ' delivery, within ' + z.eta + '.';
    $('t-state').textContent = STEPS[cur][0];
    $('t-zone').textContent = z.label;
    $('t-win').textContent = z.eta;

    $('t-steps').innerHTML = STEPS.map(function (s, i) {
      var cls = i < cur ? 'is-done' : i === cur ? (cur === 4 ? 'is-done' : 'is-now') : '';
      var node = (i < cur || cur === 4) ? '<span class="ic ic-check"></span>' : (i + 1);
      return '<li class="trk-step ' + cls + '"><span class="trk-node">' + node + '</span>' +
        '<div><p class="trk-t">' + s[0] + '</p><p class="trk-d">' + s[1] + '</p></div></li>';
    }).join('');

    var pct = cur / (STEPS.length - 1) * 100;
    $('t-line').style.setProperty('--p', 0);
    requestAnimationFrame(function () { requestAnimationFrame(function () { $('t-line').style.setProperty('--p', pct); }); });
    $('track-result').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    show($('t-no').value);
  });

  document.querySelectorAll('[data-sample]').forEach(function (b) {
    b.addEventListener('click', function () {
      $('t-no').value = b.getAttribute('data-sample');
      show(b.getAttribute('data-sample'));
    });
  });

  var q = new URLSearchParams(location.search).get('no');
  if (q) { $('t-no').value = q; show(q); }
})();
