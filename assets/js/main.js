/* NEBULA MART — main.js (all pages: menu/drawer, quick view, cart store, page modules) */
(function () {
  'use strict';
  var PAGE = document.body.getAttribute('data-page') || '';
  function run(name, fn) { try { fn() } catch (e) { console.error('[main.js:' + name + ']', e) } }

  /* menu */
  if (document.getElementById('open-menu')) {
    run('menu', function () {
      (function () {
        var menu = document.getElementById('mobile-menu');
        var cart = document.getElementById('cart-drawer');
        var openMenu = document.getElementById('open-menu');
        var openCart = document.getElementById('open-cart');

        function toggle(el, btn, show) {
          el.classList.toggle('hidden', !show);
          document.body.style.overflow = show ? 'hidden' : '';
          if (btn) btn.setAttribute('aria-expanded', show ? 'true' : 'false');
        }

        openMenu.addEventListener('click', function () { toggle(menu, openMenu, true); });
        openCart.addEventListener('click', function () { toggle(cart, openCart, true); });
        menu.querySelectorAll('[data-close-menu]').forEach(function (el) {
          el.addEventListener('click', function () { toggle(menu, openMenu, false); });
        });
        cart.querySelectorAll('[data-close-cart]').forEach(function (el) {
          el.addEventListener('click', function () { toggle(cart, openCart, false); });
        });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { toggle(menu, openMenu, false); toggle(cart, openCart, false); }
        });
        document.getElementById('year').textContent = new Date().getFullYear();
      })();
    });
  }

  /* quickview */
  if (document.getElementById('qv') && document.getElementById('toast')) {
    run('quickview', function () {
      (function () {
        var qv = document.getElementById('qv'), tt = document.getElementById('toast'), cb = document.querySelector('#open-cart .bg-accent'), tm;
        function toast(m) { tt.textContent = m; tt.style.opacity = 1; clearTimeout(tm); tm = setTimeout(function () { tt.style.opacity = 0 }, 2000) }
        function cq() { qv.classList.add('hidden') }
        document.addEventListener('click', function (e) {
          var b;
          if (b = e.target.closest('.qv')) { var d = b.dataset; qv.querySelector('#qv-img').src = d.img; qv.querySelector('#qv-img').alt = d.name; qv.querySelector('#qv-name').textContent = d.name; qv.querySelector('#qv-price').textContent = d.price; qv.querySelector('#qv-old').textContent = d.old; qv.querySelector('#qv-old').parentElement.classList.toggle('hidden', !d.old); qv.querySelector('#qv-link').href = d.href; var qc = qv.querySelector('#qv-cat'), qa = b.closest('article'), qe = qa && qa.querySelector('p.text-xs'); qc.textContent = qe ? qe.textContent.trim() : ''; qc.hidden = !qc.textContent; var qd = qv.querySelector('#qv-desc'); qd.textContent = d.desc || ''; qd.hidden = !d.desc; qv.classList.remove('hidden') }
          else if (e.target.closest('[data-close-qv]')) cq();
          else if (b = e.target.closest('.addcart')) { var q = b.id === 'add-main' ? +document.getElementById('qty').value : 1; if (window.RD && RD.add) RD.add(b, q); toast('Added to cart') }
          else if (b = e.target.closest('.wish')) { var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.classList.toggle('bg-primary', on); b.classList.toggle('text-white', on); toast(on ? 'Saved to wishlist' : 'Removed from wishlist') }
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cq() })
      })();
    });
  }

  /* store */
  if (true) {
    run('store', function () {
      window.RD = (function () {
        var DEF = [{ id: 'axis-y-glow-serum', name: 'AXIS-Y Dark Spot Correcting Glow Serum – 50ml', img: 'https://bk.shajgoj.com/storage/2023/09/AXIS-Y_Dark_Spot_Correcting_Glow_Serum_aa3016a8-b55b-4300-9c6f-0e268d4d09dd_1000x.jpg', variant: 'Size: 50ml', price: 1299, old: 2000, qty: 1 },
        { id: 'cotton-panjabi-oxxo', name: 'OXXO Premium Cotton Panjabi for Men', img: 'https://static-01.daraz.com.bd/p/cd3f9075872dc0870834f28ba6c2d397.jpg', variant: 'Size: L', price: 946, old: 1300, qty: 1 },
        { id: 'the-ordinary-niacinamide', name: 'The Ordinary Niacinamide 10% + Zinc 1% – 30ml', img: 'https://bk.shajgoj.com/storage/2026/05/4559.jpg', variant: '30ml', price: 1099, old: 1650, qty: 2 }];
        var ZONES = { dhaka: { label: 'Inside Dhaka', fee: 70, eta: '1-2 days', days: 2 }, sub: { label: 'Sub-Dhaka', fee: 100, eta: '2-3 days', days: 3 }, out: { label: 'Outside Dhaka', fee: 150, eta: '3-5 days', days: 5 } };
        function get(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } }
        function set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch (e) { } }
        function tk(n) { return '৳' + Number(n).toLocaleString('en-US') }
        function totals(c, o) { var s = 0, v = 0; c.forEach(function (i) { s += i.price * i.qty; v += (i.old - i.price) * i.qty }); var d = o.coupon === 'NEBULA10' ? Math.round(s * 0.1) : 0, f = c.length ? ZONES[o.zone || 'dhaka'].fee : 0; return { sub: s, save: v, disc: d, fee: f, total: s - d + f } }
        function hdr(c) { var q = 0, s = 0; c.forEach(function (i) { q += i.qty; s += i.qty * i.price }); var b = document.querySelector('#open-cart .bg-accent'), t = document.querySelector('#open-cart > span:last-child'); if (b) b.textContent = q; if (t) t.textContent = tk(s) }
        return { DEF: DEF, ZONES: ZONES, tk: tk, totals: totals, hdr: hdr, cart: function () { return get('rd_cart', DEF) }, saveCart: function (c) { set('rd_cart', c) }, order: function () { return get('rd_order', { zone: 'dhaka', coupon: '' }) }, saveOrder: function (o) { set('rd_order', o) }, last: function () { return get('rd_last', null) }, saveLast: function (v) { set('rd_last', v) } }
      })();
    });
  }

  /* floating cart + live mini cart drawer */
  run('floatcart', function () {
    var orig = RD.hdr, drawer = document.getElementById('cart-drawer');
    function money(n) { return '৳' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
    function num(v) { return +String(v || 0).replace(/,/g, '') || 0 }
    var fab = null;
    if (['cart', 'checkout', 'success'].indexOf(PAGE) < 0) {
      fab = document.createElement('button');
      fab.type = 'button'; fab.id = 'float-cart';
      fab.setAttribute('aria-label', 'Open cart');
      fab.innerHTML = '<span class="fc-top"><svg class="fc-ico" aria-hidden="true"><use href="#i-bag"/></svg><span class="fc-n">0 Items</span></span><span class="fc-total">৳0.00</span>';
      document.body.appendChild(fab);
      fab.addEventListener('click', function () { var b = document.getElementById('open-cart'); if (b) b.click() });
    }
    var list = drawer && drawer.querySelector('ul'), head = drawer && drawer.querySelector('h2 span'), sub = drawer && drawer.querySelector('.border-t-4 .flex span:last-child');
    function paintDrawer(c, q, s) {
      if (!drawer) return;
      if (head) head.textContent = '(' + q + ')';
      if (sub) sub.textContent = RD.tk(s);
      if (list) list.innerHTML = c.length ? c.map(function (i, k) {
        return '<li class="flex gap-3 p-3 rounded-2xl border border-line"><img referrerpolicy="no-referrer" src="' + i.img + '" alt="' + i.name + '" width="80" height="80" class="w-20 h-20 rounded-xl object-cover border border-line shrink-0"><div class="flex-1 min-w-0"><div class="flex justify-between gap-2"><p class="font-bold leading-snug">' + i.name + '</p><button type="button" data-frm="' + k + '" class="self-start p-1 rounded-lg hover:bg-primary hover:text-white" aria-label="Remove ' + i.name + '"><svg class="w-4 h-4"><use href="#i-x"/></svg></button></div><p class="text-sm text-ink/60">' + i.variant + '</p><div class="flex items-center justify-between mt-2"><div class="flex items-center border border-line rounded-lg font-bold text-sm"><button type="button" data-fq="' + k + '" data-fd="-1" class="px-2.5 py-1" aria-label="Decrease">−</button><span class="px-2">' + i.qty + '</span><button type="button" data-fq="' + k + '" data-fd="1" class="px-2.5 py-1" aria-label="Increase">+</button></div><span class="font-extrabold">' + RD.tk(i.price * i.qty) + '</span></div></div></li>'
      }).join('') : '<li class="text-center py-10 font-bold text-ink/60">Your cart is empty.</li>';
    }
    RD.hdr = function (c) {
      orig(c);
      var q = 0, s = 0; c.forEach(function (i) { q += i.qty; s += i.qty * i.price });
      if (fab) { fab.querySelector('.fc-n').textContent = q + (q === 1 ? ' Item' : ' Items'); fab.querySelector('.fc-total').textContent = money(s) }
      var ob = document.getElementById('open-cart'); if (ob) ob.setAttribute('aria-label', 'Open cart, ' + q + (q === 1 ? ' item' : ' items'));
      paintDrawer(c, q, s)
    };
    RD.add = function (b, q) {
      if (PAGE === 'cart') return;
      var c = RD.cart(), a = b.closest('article'), qv = a && a.querySelector('.qv'), p = null, main = b.id === 'add-main';
      if (qv) { var d = qv.dataset; p = { id: d.name, name: d.name, img: d.img, variant: 'Standard', price: num(d.price), old: num(d.old) || num(d.price) } }
      else if (main) {
        var B = RD.DEF[0], col = document.querySelector('input[name=color]:checked'), lb = col && col.nextElementSibling;
        p = { id: B.id, name: B.name, img: B.img, variant: lb ? 'Size: ' + lb.textContent.trim() : B.variant, price: B.price, old: B.old }
      }
      if (!p) return;
      var f = c.filter(function (x) { return x.name === p.name && (!main || x.variant === p.variant) })[0];
      if (f) f.qty = Math.min(10, f.qty + (q || 1)); else { p.qty = Math.min(10, q || 1); c.push(p) }
      RD.saveCart(c); RD.hdr(c);
      if (fab) { fab.classList.remove('fc-pulse'); void fab.offsetWidth; fab.classList.add('fc-pulse') }
    };
    if (drawer) drawer.addEventListener('click', function (e) {
      var b = e.target.closest('[data-frm],[data-fq]'); if (!b) return;
      var c = RD.cart();
      if (b.hasAttribute('data-frm')) c.splice(+b.dataset.frm, 1);
      else { var i = c[+b.dataset.fq]; if (i) i.qty = Math.max(1, Math.min(10, i.qty + +b.dataset.fd)) }
      RD.saveCart(c);
      if (PAGE === 'cart') { location.reload(); return }
      RD.hdr(c)
    });
    RD.hdr(RD.cart())
  });

  /* hero */
  if (PAGE === 'home') {
    run('hero', function () {
      (function () {
        var h = document.getElementById('hero'); if (!h) return; var t = document.getElementById('hero-track'), sl = t.children, n = sl.length, i = 0, tm, dots = h.querySelectorAll('[data-dot]');
        function go(k) { i = (k + n) % n; t.style.transform = 'translateX(-' + i * 100 + '%)';[].forEach.call(sl, function (s, j) { s.setAttribute('aria-hidden', j !== i) }); dots.forEach(function (d, j) { d.setAttribute('aria-current', j === i); d.classList.toggle('w-10', j === i); d.classList.toggle('w-3', j !== i) }) }
        function stop() { clearInterval(tm) }
        function play() { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; stop(); tm = setInterval(function () { go(i + 1) }, 5000) }
        h.querySelector('[data-prev]').onclick = function () { go(i - 1) }; h.querySelector('[data-next]').onclick = function () { go(i + 1) };
        dots.forEach(function (d, j) { d.onclick = function () { go(j) } });
        h.addEventListener('mouseenter', stop); h.addEventListener('mouseleave', play); h.addEventListener('focusin', stop); h.addEventListener('focusout', play); go(0); play()
      })();
    });
  }

  /* product */
  if (PAGE === 'product') {
    run('product', function () {
      (function () {
        var m = document.getElementById('main-img'), ts = document.querySelectorAll('.thumb');
        ts.forEach(function (t, i) { t.onclick = function () { m.src = t.dataset.full; m.alt = 'AXIS-Y Glow Serum, view ' + (i + 1); ts.forEach(function (x) { x.classList.replace('border-primary', 'border-line') }); t.classList.replace('border-line', 'border-primary') } });
        var q = document.getElementById('qty');
        document.getElementById('q-').onclick = function () { q.value = Math.max(1, +q.value - 1) }; document.getElementById('q+').onclick = function () { q.value = Math.min(10, +q.value + 1) };
        var r = document.getElementById('rel-track');
        document.getElementById('rel-prev').onclick = function () { r.scrollBy({ left: -r.clientWidth * 0.8 }) }; document.getElementById('rel-next').onclick = function () { r.scrollBy({ left: r.clientWidth * 0.8 }) };
        var tm; function stop() { clearInterval(tm) }
        function play() { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; stop(); tm = setInterval(function () { if (r.scrollLeft >= r.scrollWidth - r.clientWidth - 4) r.scrollTo({ left: 0 }); else r.scrollBy({ left: r.firstElementChild.offsetWidth + 16 }) }, 3000) }
        ['mouseenter', 'focusin', 'touchstart'].forEach(function (e) { r.addEventListener(e, stop, { passive: true }) });['mouseleave', 'focusout', 'touchend'].forEach(function (e) { r.addEventListener(e, play, { passive: true }) }); play();
        var tabs = [].slice.call(document.querySelectorAll('.tab'));
        function sel(x0) { tabs.forEach(function (x) { var on = x === x0; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; x.classList.toggle('bg-primary', on); x.classList.toggle('text-white', on); x.classList.toggle('bg-white', !on); document.getElementById(x.getAttribute('aria-controls')).hidden = !on }) }
        tabs.forEach(function (x, i) { x.onclick = function () { sel(x) }; x.onkeydown = function (e) { var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (k) { var n = tabs[(i + k + tabs.length) % tabs.length]; sel(n); n.focus() } } });
      })();
    });
  }

  /* shop: merge API electronics into the static real products */
  function shopApi(done) {
    var grid = document.getElementById('shop-grid'), fin = false;
    function finish() { if (fin) return; fin = true; counts(); done() }
    function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] }) }
    function counts() {
      var lis = [].slice.call(grid.children);
      ['cat', 'brand'].forEach(function (n) {
        document.querySelectorAll('input[name="' + n + '"]').forEach(function (i) {
          var c = lis.filter(function (li) { return li.dataset[n] === i.value }).length, lb = i.closest('label'), sp = lb && lb.querySelector('span:last-child');
          if (sp) sp.textContent = c; if (lb) lb.hidden = c === 0
        })
      })
    }
    function li(p, k) {
      var name = esc(p.name), price = Math.round(+p.price) || 0, img = esc(p.image || 'assets/images/placeholder.svg'), href = 'product.html?id=' + encodeURIComponent(p.id), pf = price.toLocaleString('en-US');
      return '<li data-cat="Electronics" data-brand="" data-color="" data-size="" data-price="' + price + '" data-n="' + (10 + k) + '" data-idx="' + (100 + k) + '"><article class="group relative bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"><div class="relative overflow-hidden bg-primary-soft"><a href="' + href + '" class="block aspect-square" tabindex="-1" aria-hidden="true"><img src="' + img + '" referrerpolicy="no-referrer" alt="' + name + '" width="600" height="600" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"></a><div class="card-actions"><button type="button" class="wish w-9 h-9 grid place-items-center rounded-full bg-white border border-line hover:bg-primary hover:text-white" aria-label="Add ' + name + ' to wishlist" aria-pressed="false"><svg class="w-5 h-5"><use href="#i-heart" /></svg></button><button type="button" class="qv" aria-label="Quick view ' + name + '" data-name="' + name + '" data-price="' + pf + '" data-old="" data-desc="' + esc(p.description) + '" data-img="' + img + '" data-href="' + href + '"><svg class="w-5 h-5"><use href="#i-eye" /></svg></button></div></div><div class="p-4 flex flex-col flex-1"><p class="text-xs font-bold text-primary">Electronics</p><h3 class="font-bold leading-snug mt-1 line-clamp-2"><a href="' + href + '" class="hover:text-primary">' + name + '</a></h3><p class="ldesc hidden text-sm text-ink/70 mt-2">' + esc(p.description) + '</p><div class="mt-auto pt-3 flex items-baseline gap-2"><span class="font-display font-extrabold text-xl">৳' + pf + '</span></div></div><button type="button" class="addcart card-cart" aria-label="Add ' + name + ' to cart">Add to cart</button></article></li>'
    }
    var t = setTimeout(finish, 10000);
    fetch('https://api.graphicdesigncourse.net/api/products', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json() })
      .then(function (j) {
        var list = Array.isArray(j) ? j : j && (Array.isArray(j.data) ? j.data : j.data && Array.isArray(j.data.data) ? j.data.data : Array.isArray(j.products) ? j.products : null);
        if (!list) throw new Error('Unexpected API response');
        j = { data: list.map(function (p) { return { id: p.id != null ? p.id : p._id, name: p.name || p.title, price: p.price != null ? p.price : p.sale_price, image: p.image || p.thumbnail || (p.images && p.images[0]) || '', description: p.description || '' } }) };
        if (j.data.length && !fin) {
          grid.insertAdjacentHTML('beforeend', j.data.map(li).join(''));
          var mx = Math.max.apply(null, j.data.map(function (p) { return +p.price || 0 })), top = Math.max(5000, Math.ceil(mx / 100) * 100), pr = document.getElementById('prange'), pm = document.getElementById('pmax');
          if (pr) { pr.max = top; pr.value = top } if (pm) pm.value = top;
          grid.querySelectorAll('img').forEach(function (im) { im.addEventListener('error', function () { if (im.src.indexOf('placeholder.svg') < 0) im.src = 'assets/images/placeholder.svg' }, { once: true }) })
        }
      })
      .catch(function (e) {
        console.error('[shop-api]', e);
        if (!document.getElementById('api-note')) grid.insertAdjacentHTML('beforebegin', '<p id="api-note" class="mt-4 bg-accent/40 border border-line rounded-xl px-4 py-3 font-bold">Electronics products load kora jaini (' + esc(e && e.message) + '). <button type="button" class="underline" onclick="location.reload()">Try again</button></p>')
      })
      .then(function () { clearTimeout(t); finish() })
  }

  /* shop */
  if (PAGE === 'shop') {
    run('shop', function () { shopApi(function () {
      (function () {
        var grid = document.getElementById('shop-grid'), items = [].slice.call(grid.children), panel = document.getElementById('filter-panel'), ov = document.getElementById('f-ov'),
          pmin = document.getElementById('pmin'), pmax = document.getElementById('pmax'), pr = document.getElementById('prange'), chipsEl = document.getElementById('chips'),
          more = document.getElementById('more'), shown = 12, step = 6, PM = +document.getElementById('prange').max || 5000, st = {};
        var sorters = { pop: function (a, b) { return b.dataset.n - a.dataset.n }, new: function (a, b) { return b.dataset.idx - a.dataset.idx }, lo: function (a, b) { return a.dataset.price - b.dataset.price }, hi: function (a, b) { return b.dataset.price - a.dataset.price } };
        function vals(n) { return [].map.call(document.querySelectorAll('input[name="' + n + '"]:checked'), function (i) { return i.value }) }
        function read() { st.cat = vals('cat'); st.brand = vals('brand'); st.color = vals('color'); st.size = vals('size'); st.min = +pmin.value || 0; st.max = pmax.value === '' ? 1e9 : +pmax.value }
        function chip(f, v, l) { return '<button type="button" data-f="' + f + '" data-v="' + v + '" class="flex items-center gap-1.5 bg-accent border border-line rounded-full pl-3 pr-2 py-1 text-sm font-bold">' + l + ' <span aria-hidden="true">×</span><span class="sr-only">remove filter</span></button>' }
        function chips() { var h = '';['cat', 'brand', 'color', 'size'].forEach(function (f) { st[f].forEach(function (v) { h += chip(f, v, v) }) }); if (st.min > 0 || st.max < PM) h += chip('price', '', '৳' + st.min + ' to ৳' + st.max); chipsEl.innerHTML = h ? h + '<button type="button" data-clear-all class="underline font-bold text-sm px-2">Clear all</button>' : '' }
        var Q = (new URLSearchParams(location.search).get('q') || '').trim().toLowerCase();
        function apply() {
          read();
          var list = items.filter(function (li) {
            var d = li.dataset;
            if (Q && Q.split(/\s+/).some(function (t) { return (li.textContent + ' ' + d.cat + ' ' + d.brand).toLowerCase().indexOf(t) < 0 })) return false;
            if (st.cat.length && st.cat.indexOf(d.cat) < 0) return false;
            if (st.brand.length && st.brand.indexOf(d.brand) < 0) return false;
            if (st.color.length && st.color.indexOf(d.color) < 0) return false;
            if (st.size.length && !st.size.some(function (s) { return (' ' + d.size + ' ').indexOf(' ' + s + ' ') >= 0 })) return false;
            if (+d.price < st.min || +d.price > st.max) return false; return true
          });
          list.sort(sorters[document.getElementById('sort').value]);
          items.forEach(function (li) { li.classList.add('hidden') });
          list.forEach(function (li, i) { grid.appendChild(li); li.classList.toggle('hidden', i >= shown) });
          var n = list.length, s = Math.min(shown, n);
          document.getElementById('count').textContent = n + (n === 1 ? ' product found' : ' products found');
          document.getElementById('note').textContent = 'Showing ' + s + ' of ' + n + ' products';
          document.getElementById('empty').hidden = n > 0; document.getElementById('more-wrap').hidden = n === 0; more.hidden = shown >= n;
          chips()
        }
        function clearAll() { document.querySelectorAll('#filter-panel input[type=checkbox]').forEach(function (i) { i.checked = false }); pmin.value = 0; pmax.value = PM; pr.value = PM; shown = 12; apply() }
        panel.addEventListener('change', function () { shown = 12; apply() });
        pmin.addEventListener('input', function () { shown = 12; apply() });
        pmax.addEventListener('input', function () { pr.value = pmax.value; shown = 12; apply() });
        pr.addEventListener('input', function () { pmax.value = pr.value; shown = 12; apply() });
        document.getElementById('sort').addEventListener('change', apply);
        more.addEventListener('click', function () { shown += step; apply() });
        document.getElementById('clear').addEventListener('click', clearAll);
        document.addEventListener('click', function (e) {
          if (e.target.closest('[data-clear-all]')) clearAll();
          var b = e.target.closest('#chips [data-f]');
          if (b) { var f = b.dataset.f; if (f === 'price') { pmin.value = 0; pmax.value = PM; pr.value = PM } else document.querySelector('input[name=' + f + '][value="' + b.dataset.v + '"]').checked = false; shown = 12; apply() }
          if (e.target.closest('[data-close-f]')) { panel.classList.remove('open'); ov.classList.add('hidden'); document.body.style.overflow = '' }
        });
        document.getElementById('open-filters').addEventListener('click', function () { panel.classList.add('open'); ov.classList.remove('hidden'); document.body.style.overflow = 'hidden' });
        var vg = document.getElementById('v-grid'), vl = document.getElementById('v-list');
        function view(list) { grid.classList.toggle('is-list', list);[[vg, !list], [vl, list]].forEach(function (p) { p[0].setAttribute('aria-pressed', p[1]); p[0].classList.toggle('bg-ink', p[1]); p[0].classList.toggle('text-white', p[1]); p[0].classList.toggle('bg-white', !p[1]) }) }
        vg.onclick = function () { view(false) }; vl.onclick = function () { view(true) };
        apply()
      })();
    }); });
  }

  /* cart */
  if (PAGE === 'cart') {
    run('cart', function () {
      (function () {
        var c = RD.cart(), o = RD.order(), ul = document.getElementById('items'), $ = function (i) { return document.getElementById(i) };
        function save() { RD.saveCart(c); RD.saveOrder(o); draw() }
        function draw() {
          $('cart-wrap').hidden = !c.length; $('cart-empty').hidden = c.length > 0;
          $('count').textContent = '(' + c.reduce(function (a, i) { return a + i.qty }, 0) + ' items)';
          ul.innerHTML = c.map(function (i, k) { return '<li class="flex gap-4 bg-white border border-line rounded-2xl p-4"><a href="product.html" class="shrink-0"><img referrerpolicy="no-referrer" src="' + i.img + '" alt="' + i.name + '" width="300" height="300" class="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border border-line"></a><div class="flex-1 min-w-0"><div class="flex justify-between gap-3"><div><h3 class="font-bold leading-snug"><a href="product.html" class="hover:text-primary">' + i.name + '</a></h3><p class="text-sm text-ink/60 mt-0.5">' + i.variant + '</p></div><button type="button" data-rm="' + k + '" class="self-start p-1.5 rounded-lg hover:bg-primary hover:text-white" aria-label="Remove ' + i.name + '"><svg class="w-5 h-5"><use href="#i-x"/></svg></button></div><div class="flex flex-wrap items-end justify-between gap-3 mt-3"><div class="flex items-center border border-line rounded-xl font-bold"><button type="button" data-q="' + k + '" data-d="-1" class="px-3.5 py-2" aria-label="Decrease quantity">−</button><span class="px-3 min-w-8 text-center">' + i.qty + '</span><button type="button" data-q="' + k + '" data-d="1" class="px-3.5 py-2" aria-label="Increase quantity">+</button></div><div class="text-right"><p class="font-display font-extrabold text-xl">' + RD.tk(i.price * i.qty) + '</p><p class="text-xs text-ink/55">' + RD.tk(i.price) + ' each <s class="ml-1">' + RD.tk(i.old) + '</s></p></div></div></div></li>' }).join('');
          var t = RD.totals(c, o);
          $('t-sub').textContent = RD.tk(t.sub); $('t-save').textContent = '-' + RD.tk(t.save); $('r-save').hidden = !t.save;
          $('r-disc').hidden = !t.disc; $('t-disc').textContent = '-' + RD.tk(t.disc); $('t-fee').textContent = RD.tk(t.fee); $('t-total').textContent = RD.tk(t.total);
          document.querySelector('input[name=zone][value=' + (o.zone || 'dhaka') + ']').checked = true;
          if (o.coupon) { $('coupon').value = o.coupon; $('cmsg').innerHTML = '<span class="text-success font-bold">NEBULA10 applied: 10% off.</span> <button type="button" id="rmc" class="underline">Remove</button>' }
          RD.hdr(c)
        }
        document.addEventListener('click', function (e) {
          var b;
          if (b = e.target.closest('[data-rm]')) { c.splice(+b.dataset.rm, 1); save() }
          else if (b = e.target.closest('[data-q]')) { var i = c[+b.dataset.q]; i.qty = Math.max(1, Math.min(10, i.qty + +b.dataset.d)); save() }
          else if (e.target.id === 'rmc') { o.coupon = ''; $('coupon').value = ''; $('cmsg').textContent = ''; save() }
          else if (b = e.target.closest('.addcart')) {
            var a = b.closest('article'); if (!a) return; var d = a.querySelector('.qv').dataset, p = +d.price.replace(/,/g, ''), f = c.filter(function (x) { return x.name === d.name })[0];
            if (f) f.qty++; else c.push({ id: d.name, name: d.name, img: d.img, variant: 'Standard', price: p, old: +d.old.replace(/,/g, ''), qty: 1 }); save()
          }
        });
        $('apply').onclick = function () { var v = $('coupon').value.trim().toUpperCase(); if (v === 'NEBULA10') { o.coupon = v; save() } else { o.coupon = ''; $('cmsg').innerHTML = '<span class="text-danger font-bold">This code is not valid.</span>'; RD.saveOrder(o); draw(); $('cmsg').innerHTML = '<span class="text-danger font-bold">This code is not valid.</span>' } };
        document.querySelectorAll('input[name=zone]').forEach(function (r) { r.onchange = function () { o.zone = r.value; save() } });
        draw()
      })();
    });
  }

  /* checkout */
  if (PAGE === 'checkout') {
    run('checkout', function () {
      (function () {
        var BD = { 'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Narsingdi', 'Manikganj', 'Munshiganj', 'Tangail', 'Kishoreganj', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'], 'Chattogram': ['Chattogram', 'Cox\'s Bazar', 'Cumilla', 'Feni', 'Brahmanbaria', 'Noakhali', 'Lakshmipur', 'Chandpur', 'Rangamati', 'Bandarban', 'Khagrachhari'], 'Rajshahi': ['Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon', 'Chapainawabganj', 'Joypurhat'], 'Khulna': ['Khulna', 'Jashore', 'Satkhira', 'Bagerhat', 'Kushtia', 'Jhenaidah', 'Magura', 'Narail', 'Chuadanga', 'Meherpur'], 'Barishal': ['Barishal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Jhalokathi', 'Barguna'], 'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'], 'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'], 'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'] };
        var CITY = ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur', 'Motijheel', 'Tejgaon', 'Badda', 'Rampura', 'Khilgaon', 'Jatrabari', 'Bashundhara', 'Malibagh', 'Shyamoli', 'Farmgate', 'Old Dhaka', 'Demra', 'Lalbagh'], OUT = ['Savar', 'Keraniganj', 'Dhamrai', 'Nawabganj', 'Dohar'];
        var c = RD.cart(), o = RD.order(), $ = function (i) { return document.getElementById(i) };
        if (!c.length) { location.replace('cart.html'); return }
        var form = $('co'), dv = $('division'), dt = $('district'), as = $('area-sel'), at = $('area-txt');
        function opts(el, arr, ph) { el.innerHTML = '<option value="">' + ph + '</option>' + arr.map(function (x) { return '<option>' + x + '</option>' }).join('') }
        opts(dv, Object.keys(BD), 'Select division');
        function zone() { var d = dt.value, a = as.hidden ? at.value : as.value; if (!d) return null; if (d === 'Dhaka') return a ? (CITY.indexOf(a) >= 0 ? 'dhaka' : 'sub') : null; return (d === 'Gazipur' || d === 'Narayanganj') ? 'sub' : 'out' }
        function money() {
          var t = RD.totals(c, o);
          $('mini').innerHTML = c.map(function (i) { return '<li class="flex items-center gap-3"><span class="relative shrink-0"><img referrerpolicy="no-referrer" src="' + i.img + '" alt="" width="300" height="300" class="w-14 h-14 rounded-lg object-cover border border-line"><span class="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-ink text-white text-xs font-bold grid place-items-center">' + i.qty + '</span></span><span class="flex-1 min-w-0 text-sm font-bold leading-snug">' + i.name + '</span><span class="font-bold text-sm">' + RD.tk(i.price * i.qty) + '</span></li>' }).join('');
          $('t-sub').textContent = RD.tk(t.sub); $('r-disc').hidden = !t.disc; $('t-disc').textContent = '-' + RD.tk(t.disc); $('t-fee').textContent = RD.tk(t.fee); $('t-zone').textContent = '(' + RD.ZONES[o.zone].label + ')'; $('t-total').textContent = RD.tk(t.total);
          document.querySelectorAll('.pay-amt').forEach(function (e) { e.textContent = RD.tk(t.total) });
          $('zone-msg').textContent = RD.ZONES[o.zone].label + ' delivery: ' + RD.tk(t.fee) + ', arrives in ' + RD.ZONES[o.zone].eta + '.'; RD.hdr(c)
        }
        function upd() { var z = zone(); if (z) { o.zone = z; RD.saveOrder(o) } money() }
        dv.onchange = function () { opts(dt, BD[dv.value] || [], 'Select district'); dt.disabled = !dv.value; dt.onchange() };
        dt.onchange = function () { var d = dt.value === 'Dhaka'; as.hidden = !d; as.disabled = !d; as.required = d; at.hidden = d; at.disabled = d; at.required = !d; if (d) opts(as, CITY.concat(OUT), 'Select area'); upd() };
        as.onchange = upd; at.oninput = upd;
        as.hidden = true; as.disabled = true;
        var pays = document.querySelectorAll('input[name=pay]');
        function pp() {
          var v = document.querySelector('input[name=pay]:checked').value;
          document.querySelectorAll('[data-pay-panel]').forEach(function (p) { p.hidden = p.dataset.payPanel !== v });
          document.querySelectorAll('[data-pay]').forEach(function (i) { var on = i.dataset.pay === v; i.disabled = !on; i.required = on })
        }
        pays.forEach(function (r) { r.onchange = pp }); pp();
        form.addEventListener('submit', function (e) {
          e.preventDefault(); if (!form.reportValidity()) return;
          var f = new FormData(form), p = f.get('pay'), t = RD.totals(c, o), area = as.hidden ? at.value : as.value;
          var no = 'RD' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + Math.floor(10000 + Math.random() * 90000);
          RD.saveLast({ no: no, at: new Date().toISOString(), name: f.get('name'), phone: f.get('phone'), email: f.get('email'), division: f.get('division'), district: f.get('district'), area: area, address: f.get('address'), note: f.get('note'), pay: p, trx: f.get(p + '_trx') || f.get('bank_ref') || '', zone: o.zone, items: c, t: t });
          RD.saveCart([]); RD.saveOrder({ zone: o.zone, coupon: '' }); location.href = 'success.html'
        });
        money()
      })();
    });
  }

  /* success */
  if (PAGE === 'success') {
    run('success', function () {
      (function () {
        var $ = function (i) { return document.getElementById(i) }, D = RD.DEF;
        var L = RD.last() || { no: 'RD26100312345', at: new Date().toISOString(), name: 'Rahim Uddin', phone: '01712345678', email: 'rahim@example.com', division: 'Dhaka', district: 'Dhaka', area: 'Dhanmondi', address: 'House 12, Road 5', note: '', pay: 'cod', trx: '', zone: 'dhaka', items: D, t: RD.totals(D, { zone: 'dhaka', coupon: '' }) };
        var Z = RD.ZONES[L.zone] || RD.ZONES.dhaka, PN = { cod: 'Cash on delivery', bkash: 'bKash', nagad: 'Nagad', card: 'Debit or credit card', bank: 'Bank transfer' };
        $('who').textContent = L.name.split(' ')[0]; $('no').textContent = L.no;
        $('sent').textContent = 'We sent a confirmation to ' + L.email + ' and will text ' + L.phone + ' when your order ships.';
        $('items').innerHTML = L.items.map(function (i) { return '<li class="flex items-center gap-4"><img referrerpolicy="no-referrer" src="' + i.img + '" alt="' + i.name + '" width="300" height="300" class="w-16 h-16 rounded-xl object-cover border border-line"><div class="flex-1 min-w-0"><p class="font-bold leading-snug">' + i.name + '</p><p class="text-sm text-ink/60">' + i.variant + ' · Qty ' + i.qty + '</p></div><p class="font-bold">' + RD.tk(i.price * i.qty) + '</p></li>' }).join('');
        var t = L.t; $('t-sub').textContent = RD.tk(t.sub); $('r-disc').hidden = !t.disc; $('t-disc').textContent = '-' + RD.tk(t.disc); $('t-fee').textContent = RD.tk(t.fee); $('t-total').textContent = RD.tk(t.total);
        $('a-name').textContent = L.name; $('a-addr').textContent = L.address + ', ' + L.area + ', ' + L.district + ', ' + L.division; $('a-phone').textContent = L.phone;
        if (L.note) { $('a-note').hidden = false; $('a-note').textContent = 'Note: ' + L.note }
        var d = new Date(L.at); d.setDate(d.getDate() + Z.days);
        $('eta').textContent = Z.label + ', within ' + Z.eta + ' (by ' + d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ')';
        $('p-name').textContent = PN[L.pay];
        $('p-status').textContent = L.pay === 'cod' ? 'Please pay ' + RD.tk(t.total) + ' in cash on delivery.' : L.pay === 'card' ? 'Complete your card payment on the secure gateway to confirm the order.' : 'We are verifying your payment' + (L.trx ? ' (ref ' + L.trx + ')' : '') + '. You will get a message once it is confirmed.';
        $('copy').onclick = function () { try { navigator.clipboard.writeText(L.no) } catch (e) { } this.textContent = 'Copied' };
        RD.hdr(RD.cart())
      })();
    });
  }


  /* demo forms (contact, sell, login, register) */
  if (document.querySelector('form[data-demo]')) {
    run('forms', function () {
      document.querySelectorAll('form[data-demo]').forEach(function (f) {
        f.addEventListener('submit', function (e) {
          e.preventDefault(); if (!f.reportValidity()) return;
          var m = document.getElementById(f.dataset.msg); m.textContent = 'Thank you! Your request has been received.'; if (f.querySelector('input[type=password]')) m.textContent = 'Done! This is a demo form, connect it to your backend.'; m.hidden = false; f.reset()
        })
      })
    });
  }

  /* orders + addresses */
  if (PAGE === 'orders' || PAGE === 'addresses') {
    run('account', function () {
      var L = RD.last(), $ = function (i) { return document.getElementById(i) };
      if (PAGE === 'orders') {
        if (!L) { $('orders-empty').hidden = false; return }
        $('orders-list').innerHTML = '<article class="bg-white border border-line rounded-3xl p-6"><div class="flex flex-wrap justify-between gap-3"><div><p class="font-bold">Order ' + L.no + '</p><p class="text-sm text-ink/60">' + new Date(L.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + L.items.length + ' item(s)</p></div><p class="font-display text-xl">' + RD.tk(L.t.total) + '</p></div><div class="mt-4 flex gap-3 flex-wrap"><a class="text-primary font-bold hover:underline" href="track.html">Track order</a><a class="text-primary font-bold hover:underline" href="success.html">View details</a></div></article>'
      }
      else {
        if (!L) { $('addr-empty').hidden = false; return }
        $('addr-list').innerHTML = '<article class="bg-white border border-line rounded-3xl p-6"><p class="font-bold">' + L.name + '</p><p class="mt-1 text-ink/75">' + L.address + ', ' + L.area + ', ' + L.district + ', ' + L.division + '</p><p class="text-sm text-ink/60 mt-1">' + L.phone + '</p></article>'
      }
    });
  }

  /* live search (AJAX: loads shop.html once, filters as you type) */
  run('search', function () {
    var forms = document.querySelectorAll('form[role=search]'); if (!forms.length) return;
    var cache = null, loading = null;
    var qs = new URLSearchParams(location.search).get('q') || '';
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] }) }
    function rx(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }
    function parse(html) {
      var doc = new DOMParser().parseFromString(html, 'text/html');
      return [].map.call(doc.querySelectorAll('#shop-grid > li'), function (li) {
        var a = li.querySelector('h3 a'), im = li.querySelector('img'), pr = li.querySelector('.font-display');
        return { name: a ? a.textContent.trim() : '', href: a ? a.getAttribute('href') : 'product.html', img: im ? im.getAttribute('src') : '', price: pr ? pr.textContent.trim() : '', cat: li.dataset.cat || '', brand: li.dataset.brand || '' };
      });
    }
    function load() {
      if (cache) return Promise.resolve(cache);
      if (!loading) loading = fetch('shop.html', { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text() }).then(function (t) { return (cache = parse(t)) }).catch(function () { loading = null; return [] });
      return loading;
    }
    forms.forEach(function (form) {
      var input = form.querySelector('input[type=search]'), pop = document.createElement('div'), act = -1, tm, seq = 0;
      pop.className = 's-pop'; pop.hidden = true; pop.setAttribute('role', 'listbox'); form.appendChild(pop);
      input.setAttribute('autocomplete', 'off'); input.setAttribute('role', 'combobox'); input.setAttribute('aria-expanded', 'false'); input.setAttribute('aria-controls', input.id + '-list'); pop.id = input.id + '-list';
      if (qs) input.value = qs;
      function show(h) { pop.innerHTML = h; pop.hidden = false; act = -1; input.setAttribute('aria-expanded', 'true') }
      function hide() { pop.hidden = true; act = -1; input.setAttribute('aria-expanded', 'false') }
      function go(q) { location.href = 'shop.html?q=' + encodeURIComponent(q) }
      function run2() {
        var q = input.value.trim(), id = ++seq;
        if (!q) { hide(); return }
        show('<div class="s-msg">Searching…</div>');
        load().then(function (all) {
          if (id !== seq) return;
          var toks = q.toLowerCase().split(/\s+/).filter(Boolean), re = new RegExp('(' + toks.map(rx).join('|') + ')', 'gi');
          var hit = all.filter(function (p) { var h = (p.name + ' ' + p.cat + ' ' + p.brand).toLowerCase(); return toks.every(function (t) { return h.indexOf(t) >= 0 }) });
          if (!hit.length) { show('<div class="s-msg">No products found for “' + esc(q) + '”</div>'); return }
          function hl(t) { return t.split(re).map(function (p, i) { return i % 2 ? '<mark>' + esc(p) + '</mark>' : esc(p) }).join('') }
          show(hit.slice(0, 10).map(function (p) {
            return '<a class="s-item" role="option" href="' + esc(p.href) + '"><img src="' + esc(p.img) + '" alt="" width="52" height="52"><span class="s-t"><span class="s-n">' + hl(p.name) + '</span><span class="s-p">' + esc(p.price) + '</span><span class="s-c">' + hl(p.brand || p.cat) + '</span></span></a>';
          }).join('') + '<a class="s-all" href="shop.html?q=' + encodeURIComponent(q) + '">See all ' + hit.length + ' result' + (hit.length === 1 ? '' : 's') + ' for “' + esc(q) + '”</a>');
        });
      }
      input.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(run2, 150) });
      input.addEventListener('focus', function () { load(); if (input.value.trim() && pop.innerHTML) pop.hidden = false });
      input.addEventListener('keydown', function (e) {
        var its = pop.querySelectorAll('.s-item');
        if (e.key === 'Escape') { hide(); return }
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && its.length) {
          e.preventDefault(); act = (act + (e.key === 'ArrowDown' ? 1 : -1) + its.length) % its.length;
          its.forEach(function (el, i) { el.classList.toggle('on', i === act) }); its[act].scrollIntoView({ block: 'nearest' });
        }
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var on = pop.querySelector('.s-item.on'); if (on) { location.href = on.getAttribute('href'); return }
        var q = input.value.trim(); if (q) go(q);
      });
      document.addEventListener('click', function (e) { if (!form.contains(e.target)) hide() });
    });
  });


  /* image fallback */
  document.addEventListener('error', function (e) { var t = e.target; if (t && t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = '1'; t.src = 'assets/images/placeholder.svg' } }, true);
})();