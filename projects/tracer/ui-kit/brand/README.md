# Brand assets

## 3mpq-logo.svg (fallback product logo)

**Standing rule:** if a project has NO product logo of its own, use the 3mpq
studio logo here. Never ship a landing with a bare text wordmark or a missing
logo slot.

- The fills are `currentColor`, so the logo takes the colour of its text
  context: dark ink on a light surface, paper-white on a dark surface. Set the
  colour on the wrapping element (e.g. `className="text-ink"` /
  `className="text-on-dark"`), and a width; height scales by the 830x206 ratio.
- Use it in the nav and the footer at minimum.
- A project WITH its own mark (e.g. Quirky's squircle + dashed-capture glyph)
  keeps its mark; this is only the fallback when there is none.

Inline it (so `currentColor` works) or import it as a component. Do not bake a
fixed hex into a copy of it.
