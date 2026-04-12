/**
 * CountUp — Webflow Embed snippet
 *
 * Animates numeric prefix of any element with `data-count-up` from 0 to its
 * text value when it scrolls into view. Preserves non-numeric suffix.
 *
 * Handles:
 *   "500+"        → 0 → 500, appends "+"
 *   "$3.2B+"      → 0 → 3.2, prepends "$", appends "B+"
 *   "18 years"    → 0 → 18, appends " years"
 *   "400+"        → 0 → 400, appends "+"
 *
 * Matches the React reference build's `<CountUp value={...}>` component.
 * Respects `prefers-reduced-motion` (shows final value instantly).
 */
<script>
(function () {
  if (typeof window === "undefined") return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = document.querySelectorAll('[data-count-up]');

  function parse(v) {
    var m = v.match(/^(\$)?(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return null;
    return {
      dollar: m[1] || "",
      number: parseFloat(m[2]),
      hasDecimal: m[2].indexOf(".") >= 0,
      suffix: m[3],
    };
  }

  function format(current, p) {
    var n = p.hasDecimal ? current.toFixed(1) : Math.round(current).toString();
    return p.dollar + n + p.suffix;
  }

  function animate(el, p) {
    var dur = 1600;
    var start = performance.now();
    var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
    function step(now) {
      var t = Math.min(1, (now - start) / dur);
      el.textContent = format(p.number * ease(t), p);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = format(p.number, p);
    }
    requestAnimationFrame(step);
  }

  els.forEach(function (el) {
    var original = el.textContent.trim();
    var p = parse(original);
    if (!p) return;
    if (reduced) { el.textContent = original; return; }
    el.textContent = format(0, p);
    var started = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          started = true;
          io.disconnect();
          animate(el, p);
        }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  });
})();
</script>
