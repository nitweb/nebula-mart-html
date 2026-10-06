/* NEBULA MART — info pages: TOC scroll-spy + reading bar, careers filter */
(function () {
  'use strict';
  var toc = document.querySelector('.toc');
  if (toc) {
    var links = [].slice.call(toc.querySelectorAll('a'));
    var secs = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
    var bar = toc.querySelector('.toc__bar i');
    var tick = function () {
      var y = window.scrollY + 140, cur = 0;
      secs.forEach(function (s, i) { if (s && s.offsetTop <= y) cur = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-on', i === cur); });
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
    };
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }
  var chips = document.querySelectorAll('[data-dept]');
  if (chips.length) {
    var jobs = document.querySelectorAll('.job');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
        var d = c.getAttribute('data-dept');
        jobs.forEach(function (j) { j.hidden = d !== 'all' && j.getAttribute('data-job') !== d; });
      });
    });
  }
})();
