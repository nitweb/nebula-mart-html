/* NEBULA MART — FAQ (search, category filter, expand all) */
(function () {
  'use strict';
  var items = [].slice.call(document.querySelectorAll('.qa'));
  if (!items.length) return;
  var search = document.getElementById('faq-q');
  var chips = [].slice.call(document.querySelectorAll('[data-cat]'));
  var count = document.getElementById('faq-count');
  var empty = document.getElementById('faq-empty');
  var toggle = document.getElementById('faq-toggle');
  var cat = 'all';

  function apply() {
    var q = (search.value || '').trim().toLowerCase(), n = 0;
    items.forEach(function (it) {
      var ok = (cat === 'all' || it.getAttribute('data-faq') === cat) && (!q || it.textContent.toLowerCase().indexOf(q) >= 0);
      it.hidden = !ok;
      if (ok) n++;
    });
    count.textContent = n + (n === 1 ? ' question' : ' questions');
    empty.hidden = n > 0;
    toggle.hidden = n === 0;
  }

  search.addEventListener('input', apply);
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      cat = c.getAttribute('data-cat');
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c); });
      apply();
    });
  });
  toggle.addEventListener('click', function () {
    var vis = items.filter(function (i) { return !i.hidden; });
    var open = vis.some(function (i) { return !i.open; });
    vis.forEach(function (i) { i.open = open; });
    toggle.textContent = open ? 'Collapse all' : 'Expand all';
  });
  var reset = document.getElementById('faq-reset');
  if (reset) reset.addEventListener('click', function () {
    search.value = '';
    chips[0].click();
  });
  apply();
})();
