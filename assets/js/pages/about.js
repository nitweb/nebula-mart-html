/* NEBULA MART — about page (stat count-up when scrolled into view) */
(function () {
  'use strict';
  var els = document.querySelectorAll('[data-to]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function fmt(n, dec) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function run(el) {
    var to = parseFloat(el.getAttribute('data-to')), dec = +el.getAttribute('data-dec') || 0;
    var suf = el.getAttribute('data-suf') || '', t0 = performance.now(), dur = 1400;
    (function tick(t) {
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e, dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
    });
  }, { threshold: .6 });
  els.forEach(function (el) { io.observe(el); });
})();
