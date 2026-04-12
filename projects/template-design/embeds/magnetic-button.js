/**
 * MagneticButton — Webflow Embed snippet
 *
 * Applies a pointer-tracking translate effect to any button or link with
 * `data-magnetic="true"`. The element drifts toward the cursor within a
 * spring-damped range, then snaps back on mouseleave.
 *
 * Matches the React reference build's `<Button magnetic>` behaviour.
 * Respects `prefers-reduced-motion`.
 */
<script>
(function () {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var STRENGTH = 12;          // px — max drift
  var LERP = 0.18;            // 0..1 — higher = snappier
  var els = document.querySelectorAll('[data-magnetic="true"]');

  els.forEach(function (el) {
    var x = 0, y = 0, tx = 0, ty = 0, raf = null;

    function loop() {
      x += (tx - x) * LERP;
      y += (ty - y) * LERP;
      el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * STRENGTH;
      ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * STRENGTH;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    el.addEventListener("mouseleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
})();
</script>
