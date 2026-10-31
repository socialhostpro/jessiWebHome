"""Turn a design-tool export zip into the deployable site/ folder.

Usage:  python build/build.py "Jessi AI — Home-html.zip"

Adds SEO tags, the custom header, share widget, privacy-promise and
join-beta modals, animations, the origin-section rework, and renders the
privacy/terms/contact pages. server.js serves the site and the contact and
waitlist forms. Then deploy with `railway up` from site/.
"""
import datetime, io, json, os, re, shutil, sys, zipfile
from urllib.parse import quote

# Public address of the site. Change this when a custom domain is attached.
SITE_URL = 'https://yourjessi.com'
SHARE_TITLE = 'Jessi AI — No data center needed'
SHARE_TEXT = 'Jessi is an on-device AI assistant that thinks on your phone, not in a data center.'
CONTACT_EMAIL = 'privacy@quantumforgerobotics.com'
LEGAL_EFFECTIVE = 'OCTOBER 28, 2026'  # bump when the privacy policy or terms change

# Pretty section URLs: path -> section id on the home page. Paths that open a modal are
# handled in routes.js; the server serves the home page for all of them.
ROUTES = {
    'no-data-center': 'impact', 'assistant': 'assistant', 'call': 'call', 'glasses': 'glasses',
    'skills': 'skills', 'skill-store': 'skillverse', 'adapts': 'adapts', 'private-by-design': 'privacy',
    'origin': 'origin', 'features': 'features', 'roadmap': 'next', 'beta': 'beta',
}
MODAL_ROUTES = ['join', 'privacy-promise']
# Paste the token from Google Search Console (HTML tag method) to verify the site.
GOOGLE_SITE_VERIFICATION = ''

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, '..', 'site')
KEEP = {'Dockerfile'}


def read(name):
    with open(os.path.join(HERE, name), encoding='utf-8') as f:
        return f.read()


SHARES = json.loads(read('shares.json'))


def attr(s):
    return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;')


def set_meta(html, key, value, prop=True):
    pat = r'(<meta %s="%s" content=")[^"]*(")' % ('property' if prop else 'name', re.escape(key))
    html, n = re.subn(pat, lambda m: m.group(1) + attr(value) + m.group(2), html, count=1)
    assert n == 1, 'meta %s not found' % key
    return html


def meta_variant(html, slug, d):
    """The home page with title, description and share tags for one section URL."""
    url, img = '%s/%s' % (SITE_URL, slug), '%s/share/%s.jpg' % (SITE_URL, slug)
    html = re.sub(r'<title>.*?</title>', '<title>%s</title>' % d['title'].replace('&', '&amp;').replace('<', '&lt;'), html, count=1, flags=re.S)
    html = set_meta(html, 'description', d['desc'], prop=False)
    for k, v in (('og:url', url), ('og:title', d['title']), ('og:description', d['desc']), ('og:image', img),
                 ('og:image:secure_url', img), ('og:image:alt', '%s %s — Jessi AI' % (d['head'], d['grad']))):
        html = set_meta(html, k, v)
    for k, v in (('twitter:title', d['title']), ('twitter:description', d['desc']), ('twitter:image', img),
                 ('twitter:image:alt', '%s %s' % (d['head'], d['grad']))):
        html = set_meta(html, k, v, prop=False)
    return html


def add_sections_jsonld(html):
    """Lists the home page's sections for search engines (helps sitelinks)."""
    items = [{'@type': 'SiteNavigationElement', 'position': i + 1, 'name': d['title'].split(' — ')[0].split(' | ')[0],
              'description': d['desc'], 'url': '%s/#%s' % (SITE_URL, d['section'])}
             for i, (slug, d) in enumerate((s, d) for s, d in SHARES.items() if 'section' in d)]
    block = ('  <script type="application/ld+json">\n  %s\n  </script>\n'
             % json.dumps({'@context': 'https://schema.org', '@type': 'ItemList', 'name': 'Jessi AI sections',
                           'itemListElement': items}, ensure_ascii=False))
    i = html.index('</head>')
    return html[:i] + block + html[i:]


def main(zip_path):
    z = zipfile.ZipFile(zip_path)
    names = [n for n in z.namelist() if not n.endswith('/')]
    pages = [n for n in names if n.endswith('.dc.html')]
    if len(pages) != 1:
        sys.exit('expected one .dc.html page in the zip, found: %s' % pages)
    for n in names:
        if n.startswith('/') or '..' in n.split('/'):
            sys.exit('refusing unsafe path in zip: ' + n)

    # Fresh site/ except the server config.
    for entry in os.listdir(SITE):
        if entry in KEEP:
            continue
        p = os.path.join(SITE, entry)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
    for n in names:
        if n == pages[0] or n.lower() == 'readme.md':
            continue
        dest = os.path.join(SITE, *n.split('/'))
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        with open(dest, 'wb') as f:
            f.write(z.read(n))

    html = io.TextIOWrapper(z.open(pages[0]), encoding='utf-8').read()

    # Public copy corrections live here so future canvas rebuilds preserve them.
    html = re.sub(r'<span>WATER/CHAT.*?</span></span>\s*', '', html)
    html = re.sub(r'<span>ENERGY/CHAT.*?</span></span>\s*', '', html)
    html = html.replace('Supported glasses models: [MODEL LIST]. ', '')
    html = re.sub(r'<div>TARGET.*?\[ROADMAP DATES\].*?</div>', '', html)
    replacements = {
        'Available now': 'Request an invitation',
        'Get the Android beta': 'Join the Android beta waitlist',
        'Get the beta &amp; call Jessi': 'Join the beta waitlist',
        "in active beta - join now and she'll start learning about you.": 'in active beta - join the waitlist to hear when your spot opens.',
        'OF YOUR DATA STORED IN THE CLOUD': 'OF YOUR EVERYDAY CHAT STORED IN THE CLOUD',
        'cloud storage of your data': 'cloud storage of everyday chat',
        'nothing stored in the cloud': 'everyday chat stays on-device',
    }
    for old, new in replacements.items():
        html = html.replace(old, new)

    html = html.replace("in active beta — join now and she'll start learning about you.",
                        'in active beta — join the waitlist to hear when your spot opens.')
    html = html.replace('Your data stays on your device.', 'Everyday chat stays on your device.')
    html = html.replace("THE CLOUD'S ONLY JOB", 'ONLINE FEATURES AND SYNC')
    html = html.replace('Your data passes through; it never parks there.',
                        'Everyday chat stays on-device. We handle account, waitlist and contact information as explained in our privacy policy.')
    # Cap expensive WebGL rendering at 30fps and pause work in background tabs.
    html = html.replace('Math.min(window.devicePixelRatio || 1, 2)',
                        'Math.min(window.devicePixelRatio || 1, 1.5)')
    for state in ('k', 'h', 'gS'):
        original = 'if (!%s.visible) { %s.raf = 0; return; }' % (state, state)
        gate = ('\n      if (document.hidden || now - (%s.lastPaint || 0) < 33) '
                '{ %s.raf = requestAnimationFrame(frame); return; }\n      %s.lastPaint = now;' % (state, state, state))
        html = html.replace(original, original + gate)
    hero = 'function frame(now) {\n      var dt = Math.min(0.05, (now - last) / 1000);'
    html = html.replace(hero, 'function frame(now) {\n      if (!reduce && (document.hidden || now - (s.lastPaint || 0) < 33)) { s.raf = requestAnimationFrame(frame); return; }\n      s.lastPaint = now;\n      var dt = Math.min(0.05, (now - last) / 1000);')

    # 1. SEO tags (replacing the export's title), viewport, behaviour scripts.
    head = '<meta charset="utf-8">'
    assert html.count(head) == 1, 'charset meta not found'
    html = re.sub(r'<title>.*?</title>\n?', '', html, count=1, flags=re.S)
    seo = read('seo-head.html').replace('{{SITE_URL}}', SITE_URL)
    routes_js = read('routes.js').replace('{{ROUTES_JSON}}', json.dumps(ROUTES))
    html = html.replace(head, head + '\n' + seo + read('head.html') + read('share.js') + routes_js, 1)

    # 2. Header: keep the export's QFR logo path, swap in ours.
    m = re.search(r'<header\b.*?</header>', html, re.S)
    assert m, 'header not found'
    img = re.search(r'<img src="([^"]+)" alt="Quantum Forge Robotics"', m.group(0))
    header = read('header.html').replace('{{QFR_IMG}}', img.group(1) if img else '')
    url = SITE_URL + '/'
    share = (read('share.html')
             .replace('{{U}}', quote(url, safe=''))
             .replace('{{T}}', quote(SHARE_TITLE, safe=''))
             .replace('{{B}}', quote(SHARE_TEXT + '\n\n' + url, safe=''))
             .replace('{{URL_SHORT}}', re.sub(r'^https?://', '', SITE_URL)))
    modals = read('promise.html').strip() + '\n' + read('waitlist.html').strip()
    html = html[:m.start()] + header.strip() + '\n' + share.strip() + '\n' + modals + html[m.end():]
    qfr_img = img.group(1) if img else ''

    # 3. Styles: append to the end of the first <helmet> style block.
    i = html.index('</style>', html.index('<helmet>'))
    css = ''.join(read(n) for n in ('enhance.css', 'share.css', 'promise.css', 'waitlist.css', 'origin.css', 'performance.css'))
    html = html[:i] + '\n' + css + html[i:]

    # 4. Links: the privacy-promise button opens the modal (falling back to /privacy),
    #    legal links go to the new pages, beta links open the waitlist modal.
    html, n = re.subn(r'href="\[PRIVACY POLICY\]"([^>]*>\s*Read the privacy promise)', r'href="/privacy" data-jx-pm-open\1', html)
    if not n:
        print('note: "Read the privacy promise" button not found')
    for old, new in (('[PRIVACY POLICY]', '/privacy'), ('[TERMS]', '/terms'), ('[CONTACT]', '/contact'),
                     ('[ANDROID BETA LINK]', '#beta" data-jx-wl="android'), ('[IOS WAITLIST LINK]', '#beta" data-jx-wl="ios')):
        html = html.replace('href="%s"' % old, 'href="%s"' % new)
    left = sorted(set(re.findall(r'href="(\[[^\]]+\])"', html)))
    if left:
        print('note: placeholder links still in the page:', ', '.join(left))

    # Section links become pretty paths (#beta stays: it opens the waitlist modal).
    path_of = {sid: '/' + p for p, sid in ROUTES.items() if sid != 'beta'}
    path_of['top'] = '/'
    html = re.sub(r'href="#([\w-]+)"', lambda m: 'href="%s"' % path_of.get(m.group(1), '#' + m.group(1)), html)
    for sid, p in path_of.items():
        html = html.replace('a[href="#%s"]' % sid, 'a[href="%s"]' % p)  # nav highlight selectors in enhance.css
    missing = [sid for sid in ROUTES.values() if 'id="%s"' % sid not in html]
    if missing:
        print('note: sections missing from this export, their URLs will open the top of the page:', ', '.join(missing))

    # 5. Origin section ("Built to run robots"): balanced layout and terminal.
    m = re.search(r'(<section id="origin"[^>]*>\s*)(.*?)(\s*<!-- Hangar -->)', html, re.S)
    if m:
        html = html[:m.start(2)] + read('origin.html').replace('{{QFR_IMG}}', qfr_img).strip() + html[m.end(2):]
    else:
        print('note: origin section layout changed; origin.html not applied')

    if GOOGLE_SITE_VERIFICATION:
        html = html.replace(head, head + '\n  <meta name="google-site-verification" content="%s">' % GOOGLE_SITE_VERIFICATION, 1)
    html = add_sections_jsonld(html)

    # Static files: icons, share images, manifest, robots and sitemap.
    pub = os.path.join(HERE, 'public')
    for n in os.listdir(pub):
        src, dst = os.path.join(pub, n), os.path.join(SITE, n)
        shutil.copytree(src, dst) if os.path.isdir(src) else shutil.copy(src, dst)
    with open(os.path.join(SITE, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write('User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n' % SITE_URL)
    today = datetime.date.today().isoformat()
    entries = [(url, 'weekly', '1.0')] + [(SITE_URL + '/' + p, 'monthly', '0.5') for p in ('privacy', 'terms', 'contact')]
    with open(os.path.join(SITE, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + ''.join('  <url><loc>%s</loc><changefreq>%s</changefreq><priority>%s</priority></url>\n'
                          % (loc, freq, pri) for loc, freq, pri in entries)
                + '</urlset>\n')
    build_pages()
    shutil.copy(os.path.join(HERE, 'server.js'), os.path.join(SITE, 'server.js'))
    # One home-page variant per section URL, so link previews and search snippets
    # (which don't run scripts) get that URL's own title, description and image.
    os.makedirs(os.path.join(SITE, 's'), exist_ok=True)
    pages = {}
    for slug, d in SHARES.items():
        with open(os.path.join(SITE, 's', slug + '.html'), 'w', encoding='utf-8') as f:
            f.write(meta_variant(html, slug, d))
        pages[slug] = 's/%s.html' % slug
    with open(os.path.join(SITE, 'routes.json'), 'w', encoding='utf-8') as f:
        json.dump({'home': sorted(list(ROUTES) + MODAL_ROUTES), 'pages': pages}, f)

    # 6. On narrow screens the hero padding tweak targets the export's inline style.
    if 'padding: 120px 24px 140px' not in html:
        print('note: hero padding style changed; mobile hero tweak will not apply')

    with open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)
    print('built site/index.html from', os.path.basename(zip_path), '-', len(names), 'files')


PAGES = [
    ('privacy', 'Privacy Policy', 'How Jessi AI handles your information: everyday chat, voice and memory stay on your device, and your data is never used for training.'),
    ('terms', 'Terms of Service', 'The terms for using Jessi AI, the on-device AI assistant from Quantum Forge Robotics.'),
    ('contact', 'Contact', 'Contact the Jessi AI team at Quantum Forge Robotics about the beta, support, privacy requests or partnerships.'),
    ('404', 'Page not found', 'This page could not be found.'),
]
NOT_FOUND = ('<p class="tag">// ERROR 404 · SIGNAL LOST</p><h1>Page not <span class="g">found.</span></h1>'
             '<p class="lede">That page is not here. It may have moved, or the link may be wrong.</p>'
             '<p><a href="/" class="home">← BACK TO JESSI</a></p>')


def build_pages():
    layout = read(os.path.join('pages', 'layout.html'))
    host = re.sub(r'^https?://', '', SITE_URL)
    for slug, title, desc in PAGES:
        content = NOT_FOUND if slug == '404' else read(os.path.join('pages', slug + '.html'))
        extra_css = read(os.path.join('pages', 'contact.css')) if slug == 'contact' else ''
        extra_js = read(os.path.join('pages', 'contact.js')) if slug == 'contact' else ''
        page = layout
        for k, v in (('{{CONTENT}}', content), ('{{EXTRA_CSS}}', extra_css), ('{{EXTRA_JS}}', extra_js)):
            page = page.replace(k, v)
        for p in ('privacy', 'terms', 'contact'):
            page = page.replace('{{CUR_%s}}' % p.upper(), ' aria-current="page"' if p == slug else '')
        page = (page.replace('{{TITLE}}', title).replace('{{DESC}}', desc).replace('{{PATH}}', '/' + slug)
                .replace('{{SITE_URL}}', SITE_URL).replace('{{SITE_HOST}}', host)
                .replace('{{EMAIL}}', CONTACT_EMAIL).replace('{{EFFECTIVE}}', LEGAL_EFFECTIVE))
        if slug == '404':
            page = page.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex">')
        else:
            ld = {'@context': 'https://schema.org', '@graph': [
                {'@type': 'ContactPage' if slug == 'contact' else 'WebPage', '@id': '%s/%s#webpage' % (SITE_URL, slug),
                 'url': '%s/%s' % (SITE_URL, slug), 'name': '%s — Jessi AI' % title, 'description': desc, 'inLanguage': 'en',
                 'isPartOf': {'@id': SITE_URL + '/#website'},
                 'publisher': {'@id': 'https://quantumforgerobotics.com/#org'}},
                {'@type': 'BreadcrumbList', 'itemListElement': [
                    {'@type': 'ListItem', 'position': 1, 'name': 'Jessi AI', 'item': SITE_URL + '/'},
                    {'@type': 'ListItem', 'position': 2, 'name': title, 'item': '%s/%s' % (SITE_URL, slug)}]}]}
            page = page.replace('</head>', '<script type="application/ld+json">%s</script>\n</head>' % json.dumps(ld, ensure_ascii=False), 1)
        left = re.findall(r'\{\{[A-Z_]+\}\}', page)
        assert not left, '%s: unfilled %s' % (slug, left)
        with open(os.path.join(SITE, slug + '.html'), 'w', encoding='utf-8') as f:
            f.write(page)


if __name__ == '__main__':
    main(sys.argv[1])
