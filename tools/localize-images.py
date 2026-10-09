#!/usr/bin/env python3
"""Download every hotlinked image used by the site and point the code at the local copy.

Run from the project root, on a computer with internet:
    python3 tools/localize-images.py --dry-run     # only list what it found
    python3 tools/localize-images.py               # download + rewrite

Images go to assets/images/products/ (named by a short hash, so the same URL is saved once).
Failed downloads are left untouched and listed at the end. Afterwards run:
    python3 tools/build-search-index.py
NOTE: downloading does not give you the right to use an image. Use your own photos,
supplier/brand-provided images, or licensed ones (Unsplash is fine).
"""
import re, sys, glob, hashlib, mimetypes, pathlib, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'assets' / 'images' / 'products'
SKIP_HOSTS = ('nebulamart.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.tailwindcss.com', 'cdnjs.cloudflare.com', 'schema.org', 'google.com/maps')
FILES = [p for pat in ('*.html', 'assets/js/*.js', 'assets/js/pages/*.js', 'assets/css/*.css', 'assets/css/pages/*.css') for p in ROOT.glob(pat)]
FILES = [p for p in FILES if p.name != 'search-index.js']
ATTR = re.compile(r'(?:src|data-img|data-src|poster)=["\'](https?://[^"\']+)["\']', re.I)
JSIMG = re.compile(r'["\'](https?://[^"\'\s]+?\.(?:jpe?g|png|webp|gif|avif)(?:[?_][^"\'\s]*)?)["\']', re.I)
EXT = {'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif', 'image/svg+xml': '.svg'}

def wanted(u): return not any(h in u for h in SKIP_HOSTS)

urls = {}
for f in FILES:
    t = f.read_text(encoding='utf-8', errors='ignore')
    for rx in (ATTR, JSIMG):
        for m in rx.finditer(t):
            u = m.group(1).replace('&amp;', '&')
            if wanted(u): urls.setdefault(u, set()).add(f.name)

print(f'{len(urls)} unique remote images found in {len(FILES)} files')
if '--dry-run' in sys.argv:
    for u, fs in sorted(urls.items()): print(' ', u, '<-', ', '.join(sorted(fs)))
    sys.exit(0)

OUT.mkdir(parents=True, exist_ok=True)
done, failed = {}, []
for i, u in enumerate(sorted(urls), 1):
    name = hashlib.sha1(u.encode()).hexdigest()[:12]
    have = list(OUT.glob(name + '.*'))
    if have:
        done[u] = have[0]; continue
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*,*/*'})
        with urllib.request.urlopen(req, timeout=30) as r:
            data, ctype = r.read(), r.headers.get_content_type()
        ext = EXT.get(ctype) or pathlib.Path(u.split('?')[0]).suffix or '.jpg'
        if not ctype.startswith('image/'): raise ValueError('not an image: ' + ctype)
        p = OUT / (name + ext); p.write_bytes(data); done[u] = p
        print(f'[{i}/{len(urls)}] ok   {u}')
    except Exception as e:
        failed.append((u, str(e))); print(f'[{i}/{len(urls)}] FAIL {u}  ({e})')

for f in FILES:
    t = f.read_text(encoding='utf-8', errors='ignore'); o = t
    for u, p in done.items():
        rel = 'assets/images/products/' + p.name
        t = t.replace(u, rel).replace(u.replace('&', '&amp;'), rel)
    if t != o: f.write_text(t, encoding='utf-8'); print('updated', f.name)

print(f'\n{len(done)} localized, {len(failed)} failed')
for u, e in failed: print('  FAILED:', u, '-', e)
