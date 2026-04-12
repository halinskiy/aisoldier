/**
 * Build a Map<resolvedRgb, cssVarName> by walking document.styleSheets once.
 * Used to annotate hex/rgb values in the panel with their CSS variable name.
 *
 * Returns entries like: `"rgb(255, 81, 42)" → "--color-accent"`.
 * The lookup normalises whitespace so `rgb(255,81,42)` matches `rgb(255, 81, 42)`.
 */
export function buildColorVarMap(): Map<string, string> {
  const map = new Map<string, string>();
  if (typeof document === "undefined") return map;

  const root = document.documentElement;
  const rs = getComputedStyle(root);

  // Walk every property declared in :root / html @theme blocks
  // The standard CSSStyleDeclaration is iterable by index.
  for (let i = 0; i < rs.length; i++) {
    const prop = rs[i];
    if (!prop.startsWith("--color")) continue;
    const val = rs.getPropertyValue(prop).trim();
    if (!val) continue;

    // Resolve the variable to an actual rgb/hex by reading a temp element
    const temp = document.createElement("span");
    temp.style.color = val;
    root.appendChild(temp);
    const resolved = getComputedStyle(temp).color;
    root.removeChild(temp);

    if (resolved) {
      const norm = resolved.replace(/\s/g, "");
      // Prefer shorter var names (first write wins)
      if (!map.has(norm)) {
        map.set(norm, prop);
      }
    }
  }

  return map;
}
