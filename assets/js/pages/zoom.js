/* NEBULA MART: product image zoom (hover + move on desktop, tap to toggle on touch) */
(function () {
  'use strict';
  var fig = document.querySelector('[data-zoom]');
  if (!fig) return;
  var img = fig.querySelector('img');
  if (!img) return;
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function origin(e) {
    var r = fig.getBoundingClientRect();
    var x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
    var y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));
    img.style.transformOrigin = x + '% ' + y + '%';
  }
  function on(e) { fig.classList.add('is-zoomed'); if (e) origin(e); }
  function off() { fig.classList.remove('is-zoomed'); img.style.transformOrigin = '50% 50%'; }

  if (canHover) {
    fig.addEventListener('mouseenter', on);
    fig.addEventListener('mousemove', function (e) { if (fig.classList.contains('is-zoomed')) origin(e); });
    fig.addEventListener('mouseleave', off);
  } else {
    fig.addEventListener('click', function (e) { if (fig.classList.contains('is-zoomed')) off(); else on(e); });
  }
  fig.setAttribute('tabindex', '0');
  fig.setAttribute('role', 'button');
  fig.setAttribute('aria-label', 'Zoom product image');
  fig.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fig.classList.toggle('is-zoomed'); }
    else if (e.key === 'Escape') off();
  });
  /* reset zoom when a thumbnail changes the main image */
  document.querySelectorAll('.thumb').forEach(function (t) { t.addEventListener('click', off); });
})();
