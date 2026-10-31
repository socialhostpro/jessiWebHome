"""Bound expensive canvas work to visible content; preserve scene and interactions."""
import re

def optimize(html):
    html = re.sub(r'<script src="(\./(?:vendor/[^\"]+|support.js|assets/[^\"]+))"></script>',
                  r'<script defer src="\1"></script>', html)
    # Unmounted/export templates must not send interpolated SVG paths to the parser.
    # SVG accepts an empty path until React replaces it with the actual icon.
    # Keep the template intact: no runtime or icon changes here.
    helper = '''  _sceneNear(canvas) {
    if (!canvas || document.hidden) return false;
    var r = canvas.getBoundingClientRect();
    return r.bottom > -200 && r.top < window.innerHeight + 200 && r.width > 0;
  }
  _deferScene(key, canvas, ready) {
    if (!canvas || typeof IntersectionObserver === 'undefined') return false;
    if (this[key + 'Ready']) return false;
    if (!this[key]) {
      this[key] = new IntersectionObserver((entries) => {
        if (!entries.some(e => e.isIntersecting)) return;
        this[key].disconnect(); this[key] = null; this[key + 'Ready'] = true;
        ready();
      }, { rootMargin: '200px' });
      this[key].observe(canvas);
    }
    return true;
  }
'''
    html = html.replace('  _bootSkills() {', helper + '  _bootSkills() {',1)
    for suffix, canvas, key in [('Skills','skillCanvas','_lazySkills'),('Hangar','hangarCanvas','_lazyHangar'),('Glass','glassCanvas','_lazyGlass')]:
        original = '    try { this._setup%s(); }' % suffix
        replacement = "    if (this._deferScene('%s', this.%s, () => this._boot%s())) return;\n" % (key,canvas,suffix) + original
        assert original in html
        html = html.replace(original,replacement,1)
    html = html.replace('  componentWillUnmount() {', '''  componentWillUnmount() {
    ['_lazySkills', '_lazyHangar', '_lazyGlass'].forEach(key => { if (this[key]) this[key].disconnect(); });
''',1)
    html = html.replace('if (Date.now() < (this._botPause || 0)) return;',
                        "if (!this._sceneNear(this.hangarCanvas) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || Date.now() < (this._botPause || 0)) return;")
    html = html.replace('if (Date.now() < (this._pauseUntil || 0)) return;',
                        "if (!this._sceneNear(this.skillCanvas) || window.matchMedia('(prefers-reduced-motion: reduce)').matches || Date.now() < (this._pauseUntil || 0)) return;")
    # Hero previously kept drawing after scrolling away, unlike the lower scenes.
    html = html.replace('    function frame(now) {\n      if (!reduce && (document.hidden',
                        '    function frame(now) {\n      if (s.visible === false) { s.raf = 0; return; }\n      if (!reduce && (document.hidden', 1)
    marker = '    if (reduce) { grown = L; frame(performance.now()); } else s.raf = requestAnimationFrame(frame);'
    observation = """    if (typeof IntersectionObserver !== 'undefined') {
      s.io = new IntersectionObserver(entries => {
        s.visible = entries[0].isIntersecting;
        if (s.visible && !s.raf && !reduce) { last = performance.now(); s.raf = requestAnimationFrame(frame); }
      });
      s.io.observe(c);
    }
"""
    assert marker in html
    html = html.replace(marker, observation + marker, 1)
    html = html.replace('    if (s.ro) s.ro.disconnect();',
                        '    if (s.ro) s.ro.disconnect();\n    if (s.io) s.io.disconnect();', 1)
    return html
