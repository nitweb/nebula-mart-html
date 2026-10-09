# NEBULA MART (HTML)

## Structure
- `assets/css/` — variables.css (theme colors), style.css (shared), tailwind.css (compiled)
- `assets/css/pages/` — page CSS: icons, common, auth, track, shipping, returns, faq, contact, about, checkout, product, shop
- `assets/js/main.js` — shared logic (cart store, menu, shop, product, checkout helpers, live search)
- `assets/js/search-index.js` — generated product list for the header search. Rebuild after editing products: `python3 tools/build-search-index.py`
- `assets/js/chat.js` — floating Call / WhatsApp / Messenger launcher (set the numbers at the top of the file)
- `assets/css/pages/extras.css` — contact launcher, flash-deals countdown, footer badges, image zoom, floating-cart position
- `assets/js/pages/` — page JS: auth, track, faq, contact, about, checkout, success
- No inline `<style>`, `style=""`, inline event handlers or inline scripts in the HTML (only JSON-LD SEO data).

## Edit later
- Office address: 4th floor, Razia Plaza, 184, Senpara Parbata, Dhaka 1216 (contact page, map, 404 page).
- About page photos: local files in `assets/images/about/`.
- Icons: `assets/css/pages/icons.css` (CSS masks, usage `<span class="ic ic-phone"></span>`).

## Store rules
- Payment: Cash on Delivery only. Couriers: Pathao, Steadfast, RedX.
- No reviews/ratings, no seller/vendor features, no language toggle.
- Flash-deals countdown resets daily at midnight Dhaka time (UTC+6).

## Before launch
- `assets/js/chat.js`: set `PHONE_NUMBER`, `WHATSAPP_NUMBER`, `MESSENGER_PAGE`.
- Replace placeholders: email addresses (`hello@nebulamart.com`, `careers@nebulamart.com`), final domain (currently `https://nitweb.github.io/nebula-mart-html/`), About page "5,000+" stat, Messenger page in `assets/js/chat.js`.
- Replace hotlinked images (daraz, shajgoj, arogga, unsplash) with own or licensed ones.
