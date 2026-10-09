/* ==========================================================================
   NEBULA MART — loop-slider.js
   Seamless, endless "one item at a time" loop for scroll-snap sliders.

   How it works: the items are cloned before and after the real ones
   ([clones][real][clones]). Sliding always moves forward by exactly one
   item; whenever the slider settles inside a clone area it is silently moved
   by one full set, so the user never sees it rewind to the first item.

   Usage (HTML):
     <ul id="cat-track"
         data-loop="3500"                    autoplay delay in ms (omit for manual only)
         data-loop-prev="[data-cat-prev]"    selector of the "previous" button
         data-loop-next="[data-cat-next]">   selector of the "next" button
     The track must be a horizontal scroll-snap container whose children
     are the items (see .cat-track in index.html, #rel-track in product.html).
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init(t) {
    var orig = [].slice.call(t.children);
    var n = orig.length;
    if (n < 2 || t.getAttribute('data-loop-ready')) return;
    t.setAttribute('data-loop-ready', '1');

    /* ---- clone the set before and after ---- */
    function clone(el) {
      var c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.setAttribute('data-loop-clone', '');
      [].forEach.call(c.querySelectorAll('a,button,input,select,textarea,[tabindex]'), function (x) { x.setAttribute('tabindex', '-1'); });
      [].forEach.call(c.querySelectorAll('[id]'), function (x) { x.removeAttribute('id'); });
      return c;
    }
    var pre = document.createDocumentFragment(), post = document.createDocumentFragment();
    orig.forEach(function (el) { pre.appendChild(clone(el)); post.appendChild(clone(el)); });
    t.insertBefore(pre, t.firstChild);
    t.appendChild(post);
    var items = [].slice.call(t.children);

    /* ---- measurements (re-read every time: widths change with breakpoints) ---- */
    function step() { return items[1].offsetLeft - items[0].offsetLeft; }   // one item incl. gap
    function span() { return items[n].offsetLeft - items[0].offsetLeft; }   // one full set

    /* run fn with smooth-scroll and snapping switched off (an invisible jump) */
    function instant(fn) {
      var sb = t.style.scrollBehavior, st = t.style.scrollSnapType;
      t.style.scrollBehavior = 'auto';
      t.style.scrollSnapType = 'none';
      fn();
      void t.offsetWidth;
      t.style.scrollBehavior = sb;
      t.style.scrollSnapType = st;
    }

    var lastIdx = 0;   // index (0..n-1) of the first visible real item, used to survive a resize

    /* keep the view inside the middle (real) set */
    function normalize() {
      var s = step(), w = span(), sl = t.scrollLeft;
      if (sl >= 2 * w - s / 2) instant(function () { t.scrollLeft = sl - w; });
      else if (sl < w - s / 2) instant(function () { t.scrollLeft = sl + w; });
      lastIdx = (((Math.round((t.scrollLeft - w) / s)) % n) + n) % n;
    }

    /* settle detection: 'scrollend' where supported, debounce everywhere else */
    var touching = false, settleTimer;
    function onSettle() { if (!touching) normalize(); }
    t.addEventListener('scroll', function () { clearTimeout(settleTimer); settleTimer = setTimeout(onSettle, 140); }, { passive: true });
    if ('onscrollend' in window) t.addEventListener('scrollend', onSettle);
    t.addEventListener('touchstart', function () { touching = true; }, { passive: true });
    t.addEventListener('touchend', function () { touching = false; clearTimeout(settleTimer); settleTimer = setTimeout(onSettle, 200); }, { passive: true });

    /* ---- start on the first real item ---- */
    instant(function () { t.scrollLeft = span(); });

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { instant(function () { t.scrollLeft = span() + lastIdx * step(); }); }, 120);
    });

    /* ---- move exactly one item ---- */
    function move(dir) {
      t.scrollBy({ left: dir * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
    }

    /* ---- autoplay ---- */
    var delay = parseInt(t.getAttribute('data-loop'), 10) || 0;
    var timer = null, paused = false, visible = true;
    function stop() { clearInterval(timer); timer = null; }
    function play() {
      stop();
      if (!delay || reduceMotion) return;
      timer = setInterval(function () { if (!paused && visible && !document.hidden) move(1); }, delay);
    }
    ['mouseenter', 'focusin'].forEach(function (e) { t.addEventListener(e, function () { paused = true; }); });
    ['mouseleave', 'focusout'].forEach(function (e) { t.addEventListener(e, function () { paused = false; }); });
    t.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    t.addEventListener('touchend', function () { paused = false; }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.1 }).observe(t);
    }

    /* ---- buttons ---- */
    function bind(sel, dir) {
      if (!sel) return;
      [].forEach.call(document.querySelectorAll(sel), function (b) {
        b.addEventListener('click', function () { move(dir); play(); });   // restart the timer after a manual click
      });
    }
    bind(t.getAttribute('data-loop-prev'), -1);
    bind(t.getAttribute('data-loop-next'), 1);

    play();
  }

  function boot() { [].forEach.call(document.querySelectorAll('[data-loop]'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.NMLoopSlider = { init: init };
})();
