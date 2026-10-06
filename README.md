# NEBULA MART (HTML)

## Structure
- `assets/css/` — variables.css (theme colors), style.css (shared), tailwind.css (compiled)
- `assets/css/pages/` — page CSS: icons, common, auth, track, shipping, returns, faq, contact, about, checkout, product, shop
- `assets/js/main.js` — shared logic (cart store, menu, shop, product, checkout helpers)
- `assets/js/pages/` — page JS: auth, track, faq, contact, about, checkout, success
- No inline `<style>`, `style=""`, inline event handlers or inline scripts in the HTML (only JSON-LD SEO data).

## Edit later
- Contact map + office address: `contact.html` (Gulshan is a placeholder; also update the footer address).
- About page photos: Unsplash links in `about.html` (broken links fall back to `assets/images/placeholder.svg`).
- Icons: `assets/css/pages/icons.css` (CSS masks, usage `<span class="ic ic-phone"></span>`).
