/* Medical section: products fetched from Arogga (Bangladesh), with real-item fallback */
(function () {
  var API_URL = 'https://api.arogga.com/general/v3/search/?_page=1&_perPage=8&_search=';
  var QUERY = 'napa';                  // search keyword (napa, seclo, fexo, ace ...)
  var LIMIT = 8;
  var PLACEHOLDER = 'assets/images/placeholder.svg';
  var FALLBACK = [
    { id: 'napa-500', name: 'Napa 500 mg Tablet (Paracetamol)', price: 12 },
    { id: 'napa-extend', name: 'Napa Extend 665 mg Tablet', price: 20 },
    { id: 'seclo-20', name: 'Seclo 20 mg Capsule (Omeprazole)', price: 56 },
    { id: 'fexo-120', name: 'Fexo 120 mg Tablet (Fexofenadine)', price: 80 },
    { id: 'ace-500', name: 'Ace 500 mg Tablet (Paracetamol)', price: 12 },
    { id: 'monas-10', name: 'Monas 10 mg Tablet (Montelukast)', price: 150 },
    { id: 'orsaline-n', name: 'Orsaline-N Oral Saline Sachet', price: 5 },
    { id: 'zimax-500', name: 'Zimax 500 mg Tablet (Azithromycin)', price: 300 }
  ];

  var grid = document.getElementById('medical-grid');
  if (!grid) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }); }

  function skeleton() {
    var h = '';
    for (var i = 0; i < 4; i++) {
      h += '<li><div class="bg-white border border-line rounded-2xl overflow-hidden animate-pulse">' +
        '<div class="aspect-square bg-primary-soft"></div>' +
        '<div class="p-4 space-y-2"><div class="h-3 w-1/3 bg-line rounded"></div>' +
        '<div class="h-4 w-3/4 bg-line rounded"></div><div class="h-5 w-1/2 bg-line rounded"></div></div></div></li>';
    }
    grid.innerHTML = h;
  }

  function normalize(p) {
    var name = p.name || p.p_name || p.brand_name || p.title || p.pv_name || '';
    var price = p.price != null ? p.price : (p.sale_price != null ? p.sale_price : (p.pv_mrp != null ? p.pv_mrp : (p.mrp != null ? p.mrp : p.p_price)));
    var img = p.image || p.p_image || p.pv_image || p.thumbnail || (p.attachedFiles && p.attachedFiles[0] && (p.attachedFiles[0].src || p.attachedFiles[0].url)) || '';
    var id = p.id != null ? p.id : (p.pv_id != null ? p.pv_id : (p.p_id != null ? p.p_id : name));
    return { id: id, name: name, price: price, image: img };
  }

  function card(p) {
    var name = esc(p.name), price = money(p.price || 0), img = esc(p.image || PLACEHOLDER);
    var href = 'product.html?id=' + encodeURIComponent(p.id);
    return '<li><article class="group relative bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">' +
      '<div class="relative overflow-hidden bg-primary-soft">' +
        '<a href="' + href + '" class="block aspect-square" tabindex="-1" aria-hidden="true">' +
          '<img src="' + img + '" alt="' + name + '" width="600" height="600" loading="lazy" ' +
          'class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"></a>' +
        '<div class="card-actions">' +
          '<button type="button" class="wish w-9 h-9 grid place-items-center rounded-full bg-white border border-line hover:bg-primary hover:text-white" ' +
            'aria-label="Add ' + name + ' to wishlist" aria-pressed="false"><svg class="w-5 h-5"><use href="#i-heart" /></svg></button>' +
          '<button type="button" class="qv" aria-label="Quick view ' + name + '" ' +
            'data-name="' + name + '" data-price="' + price + '" data-old="" data-img="' + img + '" data-href="' + href + '"><svg class="w-5 h-5"><use href="#i-eye" /></svg></button>' +
        '</div>' +
      '</div>' +
      '<div class="p-4 flex flex-col flex-1">' +
        '<p class="text-xs font-bold text-primary">Medical</p>' +
        '<h3 class="font-bold leading-snug mt-1 line-clamp-2"><a href="' + href + '" class="hover:text-primary">' + name + '</a></h3>' +
        '<div class="mt-auto pt-3 flex items-baseline gap-2"><span class="font-display font-extrabold text-xl">৳' + price + '</span></div>' +
      '</div>' +
      '<button type="button" class="addcart card-cart" aria-label="Add ' + name + ' to cart">Add to cart</button>' +
      '</article></li>';
  }

  function render(list) {
    grid.innerHTML = list.slice(0, LIMIT).map(card).join('');
    grid.querySelectorAll('img').forEach(function (im) {
      im.addEventListener('error', function () { if (im.src.indexOf('placeholder.svg') < 0) im.src = PLACEHOLDER; }, { once: true });
    });
  }

  function load() {
    skeleton();
    fetch(API_URL + encodeURIComponent(QUERY), { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (json) {
        var arr = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : (json.data && Array.isArray(json.data.items) ? json.data.items : []));
        var list = arr.map(normalize).filter(function (p) { return p.name; });
        if (!list.length) throw new Error('Empty');
        render(list);
      })
      .catch(function (e) {
        console.error('[medical-api]', e);
        render(FALLBACK);
      });
  }
  load();
})();
