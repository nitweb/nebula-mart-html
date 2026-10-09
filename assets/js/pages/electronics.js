/* Electronics section: rendered from static data (assets/js/electronics-data.js) */
(function () {
  var LIMIT = 8;                       // homepage e koyta product dekhabe
  var PLACEHOLDER = 'assets/images/placeholder.svg';

  var grid = document.getElementById('electronics-grid');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  }

  function card(p) {
    var name = esc(p.name), price = money(p.price), img = esc(p.image || PLACEHOLDER);
    var href = 'product.html?id=' + encodeURIComponent(p.id);
    return '<li><article class="group relative bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">' +
      '<div class="relative overflow-hidden bg-primary-soft">' +
        '<a href="' + href + '" class="block aspect-square" tabindex="-1" aria-hidden="true">' +
          '<img src="' + img + '" alt="' + name + '" width="600" height="600" loading="lazy" ' +
          'class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></a>' +
        '<div class="card-actions">' +
          '<button type="button" class="wish w-9 h-9 grid place-items-center rounded-full bg-white border border-line hover:bg-primary hover:text-white" ' +
            'aria-label="Add ' + name + ' to wishlist" aria-pressed="false"><svg class="w-5 h-5"><use href="#i-heart" /></svg></button>' +
          '<button type="button" class="qv" aria-label="Quick view ' + name + '" ' +
            'data-name="' + name + '" data-price="' + price + '" data-old="" data-desc="' + esc(p.description) + '" data-img="' + img + '" data-href="' + href + '"><svg class="w-5 h-5"><use href="#i-eye" /></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="p-4 flex flex-col flex-1">' +
        '<p class="text-xs font-bold text-primary">Electronics</p>' +
        '<h3 class="font-bold leading-snug mt-1 line-clamp-2"><a href="' + href + '" class="hover:text-primary">' + name + '</a></h3>' +
        '<p class="ldesc hidden text-sm text-ink/70 mt-2">' + esc(p.description) + '</p>' +
        '<div class="mt-auto pt-3 flex items-baseline gap-2"><span class="font-display font-extrabold text-xl">৳' + price + '</span></div>' +
      '</div>' +
      '<button type="button" class="addcart card-cart" aria-label="Add ' + name + ' to cart">Add to cart</button>' +
      '</article></li>';
  }

  function render(list) {
    if (!list.length) { grid.innerHTML = '<li class="col-span-full text-ink/60">No products found.</li>'; return; }
    grid.innerHTML = list.slice(0, LIMIT).map(card).join('');
    // broken image fallback (no inline onerror, README rule)
    grid.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () { if (im.src.indexOf('placeholder.svg') < 0) im.src = PLACEHOLDER; }, { once: true });
    });
  }

  render(window.NM_ELECTRONICS || []);
})();
