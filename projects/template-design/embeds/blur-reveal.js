/**
 * BlurReveal — Webflow Embed snippet
 *
 * Paste this into an HTML Embed element at the bottom of the page.
 * It replaces the MotionProvider pattern from the React reference build.
 *
 * Every element you want to reveal on scroll should get:
 *   data-motion="blur-reveal"
 *
 * Optional `data-motion-index="N"` creates a per-element stagger delay of
 * `N * 60ms` (capped at 10 steps).
 *
 * Respects `prefers-reduced-motion` and a `?motion=0` URL param (for
 * regression screenshots / static previews).
 */
<script>
(function () {
  if (typeof window === "undefined") return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var staticMode = new URLSearchParams(window.location.search).get("motion") === "0";

  var targets = Array.from(
    document.querySelectorAll('[data-motion="blur-reveal"], [data-motion="line-draw"]')
  ).filter(function (el) {
    return !el.dataset.motionState;
  });

  if (reduced || staticMode) {
    targets.forEach(function (el) {
      el.dataset.motionState = staticMode ? "visible" : "reduced";
    });
    return;
  }

  targets.forEach(function (el) {
    el.dataset.motionState = "initial";
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var idx = Number(el.dataset.motionIndex || 0);
          var delay = Math.min(idx, 10) * 60;
          setTimeout(function () {
            el.dataset.motionState = "visible";
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );

  targets.forEach(function (el) { observer.observe(el); });
})();
</script>

<style>
[data-motion="blur-reveal"][data-motion-state="initial"] {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(8px);
  will-change: opacity, transform, filter;
}
[data-motion="blur-reveal"][data-motion-state="visible"] {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
  transition:
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
[data-motion="line-draw"][data-motion-state="initial"] {
  transform: scaleX(0);
  transform-origin: left center;
}
[data-motion="line-draw"][data-motion-state="visible"] {
  transform: scaleX(1);
  transform-origin: left center;
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  [data-motion][data-motion-state] {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
</style>
