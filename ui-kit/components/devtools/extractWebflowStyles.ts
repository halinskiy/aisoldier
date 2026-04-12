/**
 * Extract and organise computed CSS properties into a structure that mirrors
 * the Webflow Style Panel sections. Filters out browser-default values so
 * the panel only shows meaningful declarations.
 *
 * Returns a `WebflowStyleMap` with sections: layout, spacing, size, position,
 * typography, backgrounds, borders, effects. Each section has a `hasNonDefault`
 * flag so the panel can hide empty sections.
 */

/* ------------------------------------------------------------------ */
/*  Public types                                                       */
/* ------------------------------------------------------------------ */

export type StyleValue = {
  property: string;
  /** Webflow-friendly label (e.g. "Font" not "font-family"). */
  label: string;
  /** Resolved computed value. */
  value: string;
  /** Unit if applicable — stripped from value for separate display. */
  unit?: string;
  /** CSS variable name if the resolved colour matches one. */
  varName?: string;
  /** true if the value is a colour (signals PropertyRow to show swatch). */
  isColor?: boolean;
};

export type StyleSection = {
  label: string;
  /** If false, the entire section is browser defaults and can be hidden. */
  hasNonDefault: boolean;
  items: StyleValue[];
};

export type WebflowStyleMap = {
  layout: StyleSection;
  spacing: StyleSection;
  size: StyleSection;
  position: StyleSection;
  typography: StyleSection;
  backgrounds: StyleSection;
  borders: StyleSection;
  effects: StyleSection;
};

/* ------------------------------------------------------------------ */
/*  Browser defaults — values we treat as "noise"                      */
/* ------------------------------------------------------------------ */

const DEFAULTS: Record<string, string | string[]> = {
  display: "block",
  flexDirection: "row",
  flexWrap: "nowrap",
  justifyContent: "normal",
  alignItems: "normal",
  alignContent: "normal",
  gap: ["normal", "normal normal", "0px", "0px 0px"],
  position: "static",
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto",
  zIndex: "auto",
  float: "none",
  width: "auto",
  minWidth: "auto",
  maxWidth: "none",
  height: "auto",
  minHeight: "auto",
  maxHeight: "none",
  overflow: ["visible", "visible visible"],
  overflowX: "visible",
  overflowY: "visible",
  aspectRatio: "auto",
  objectFit: "fill",
  opacity: "1",
  transform: "none",
  transition: ["all 0s ease 0s", "none 0s ease 0s", "none"],
  filter: "none",
  backdropFilter: "none",
  mixBlendMode: "normal",
  cursor: "auto",
  boxShadow: "none",
  textTransform: "none",
  textAlign: "start",
  fontStyle: "normal",
  textDecoration: ["none", "none solid rgb(0, 0, 0)", "none solid rgb(33, 33, 33)"],
  textShadow: "none",
  backgroundImage: "none",
  backgroundSize: "auto",
  backgroundPosition: "0% 0%",
  backgroundRepeat: "repeat",
  outlineStyle: "none",
};

function isDefault(prop: string, val: string): boolean {
  const d = DEFAULTS[prop];
  if (!d) return false;
  if (Array.isArray(d)) return d.some((v) => val === v);
  return val === d;
}

function isZeroSpacing(val: string): boolean {
  return val === "0px" || val === "0" || val === "0%";
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const COLOR_RE = /^(#|rgb|hsl|oklch|color\()/i;

function isColorValue(val: string): boolean {
  return COLOR_RE.test(val);
}

function stripFontFallbacks(family: string): string {
  return family.split(",")[0].replace(/['"]/g, "").trim();
}

function weightName(w: string): string {
  const map: Record<string, string> = {
    "100": "Thin",
    "200": "Extra Light",
    "300": "Light",
    "400": "Regular",
    "500": "Medium",
    "600": "Semi Bold",
    "700": "Bold",
    "800": "Extra Bold",
    "900": "Black",
  };
  return map[w] ?? w;
}

function item(
  property: string,
  label: string,
  value: string,
  extra?: Partial<StyleValue>,
): StyleValue {
  return { property, label, value, ...extra };
}

/* ------------------------------------------------------------------ */
/*  Main extractor                                                     */
/* ------------------------------------------------------------------ */

export function extractWebflowStyles(
  el: HTMLElement,
  colorVarMap?: Map<string, string>,
): WebflowStyleMap {
  const cs = getComputedStyle(el);
  const parentCs = el.parentElement ? getComputedStyle(el.parentElement) : null;

  function colorLabel(raw: string): Pick<StyleValue, "varName" | "isColor"> {
    const out: Pick<StyleValue, "varName" | "isColor"> = { isColor: isColorValue(raw) };
    if (out.isColor && colorVarMap) {
      const norm = raw.replace(/\s/g, "");
      const match = colorVarMap.get(norm);
      if (match) out.varName = match;
    }
    return out;
  }

  /* --- Layout ---- */
  const display = cs.display;
  const isFlex = display.includes("flex");
  const isGrid = display.includes("grid");

  const layoutItems: StyleValue[] = [
    item("display", "Display", display),
  ];

  if (isFlex) {
    layoutItems.push(
      item("flexDirection", "Direction", cs.flexDirection),
      item("flexWrap", "Wrap", cs.flexWrap),
      item("justifyContent", "Justify", cs.justifyContent),
      item("alignItems", "Align", cs.alignItems),
    );
    if (!isDefault("gap", cs.gap)) layoutItems.push(item("gap", "Gap", cs.gap));
  }

  if (isGrid) {
    layoutItems.push(
      item("gridTemplateColumns", "Columns", cs.gridTemplateColumns),
      item("gridTemplateRows", "Rows", cs.gridTemplateRows),
      item("justifyContent", "Justify", cs.justifyContent),
      item("alignItems", "Align", cs.alignItems),
    );
    if (!isDefault("gap", cs.gap)) layoutItems.push(item("gap", "Gap", cs.gap));
  }

  const layoutFiltered = layoutItems.filter(
    (i) => !isDefault(i.property, i.value),
  );

  /* --- Spacing ---- */
  const mt = cs.marginTop;
  const mr = cs.marginRight;
  const mb = cs.marginBottom;
  const ml = cs.marginLeft;
  const pt = cs.paddingTop;
  const pr = cs.paddingRight;
  const pb = cs.paddingBottom;
  const pl = cs.paddingLeft;

  const spacingItems: StyleValue[] = [];
  if (!isZeroSpacing(mt)) spacingItems.push(item("marginTop", "Margin Top", mt));
  if (!isZeroSpacing(mr)) spacingItems.push(item("marginRight", "Margin Right", mr));
  if (!isZeroSpacing(mb)) spacingItems.push(item("marginBottom", "Margin Bottom", mb));
  if (!isZeroSpacing(ml)) spacingItems.push(item("marginLeft", "Margin Left", ml));
  if (!isZeroSpacing(pt)) spacingItems.push(item("paddingTop", "Padding Top", pt));
  if (!isZeroSpacing(pr)) spacingItems.push(item("paddingRight", "Padding Right", pr));
  if (!isZeroSpacing(pb)) spacingItems.push(item("paddingBottom", "Padding Bottom", pb));
  if (!isZeroSpacing(pl)) spacingItems.push(item("paddingLeft", "Padding Left", pl));

  /* --- Size ---- */
  const sizeItems: StyleValue[] = [];
  const w = cs.width;
  const h = cs.height;
  sizeItems.push(item("width", "Width", w));
  sizeItems.push(item("height", "Height", h));
  if (!isDefault("minWidth", cs.minWidth)) sizeItems.push(item("minWidth", "Min W", cs.minWidth));
  if (!isDefault("maxWidth", cs.maxWidth)) sizeItems.push(item("maxWidth", "Max W", cs.maxWidth));
  if (!isDefault("minHeight", cs.minHeight)) sizeItems.push(item("minHeight", "Min H", cs.minHeight));
  if (!isDefault("maxHeight", cs.maxHeight)) sizeItems.push(item("maxHeight", "Max H", cs.maxHeight));
  if (!isDefault("overflowX", cs.overflowX)) sizeItems.push(item("overflowX", "Overflow X", cs.overflowX));
  if (!isDefault("overflowY", cs.overflowY)) sizeItems.push(item("overflowY", "Overflow Y", cs.overflowY));
  if (!isDefault("aspectRatio", cs.aspectRatio)) sizeItems.push(item("aspectRatio", "Aspect", cs.aspectRatio));

  /* --- Position ---- */
  const posItems: StyleValue[] = [];
  const pos = cs.position;
  if (!isDefault("position", pos)) {
    posItems.push(item("position", "Position", pos));
    if (!isDefault("top", cs.top)) posItems.push(item("top", "Top", cs.top));
    if (!isDefault("right", cs.right)) posItems.push(item("right", "Right", cs.right));
    if (!isDefault("bottom", cs.bottom)) posItems.push(item("bottom", "Bottom", cs.bottom));
    if (!isDefault("left", cs.left)) posItems.push(item("left", "Left", cs.left));
    if (!isDefault("zIndex", cs.zIndex)) posItems.push(item("zIndex", "Z-index", cs.zIndex));
  }

  /* --- Typography ---- */
  const tagName = el.tagName.toLowerCase();
  const isText = /^(h[1-6]|p|span|a|li|label|button|td|th|dt|dd|figcaption|blockquote|cite)$/.test(tagName);
  const typoItems: StyleValue[] = [];

  if (isText || el.childNodes.length > 0) {
    const family = stripFontFallbacks(cs.fontFamily);
    const weight = cs.fontWeight;
    const size = cs.fontSize;
    const lh = cs.lineHeight;
    const ls = cs.letterSpacing;
    const color = cs.color;

    typoItems.push(
      item("fontFamily", "Font", family),
      item("fontWeight", "Weight", `${weight} (${weightName(weight)})`),
      item("fontSize", "Size", size),
      item("lineHeight", "Height", lh),
    );
    if (ls !== "normal" && ls !== "0px") typoItems.push(item("letterSpacing", "Spacing", ls));
    typoItems.push(item("color", "Color", color, colorLabel(color)));
    if (!isDefault("textTransform", cs.textTransform)) typoItems.push(item("textTransform", "Transform", cs.textTransform));
    if (!isDefault("textAlign", cs.textAlign)) typoItems.push(item("textAlign", "Align", cs.textAlign));
  }

  /* --- Backgrounds ---- */
  const bgColor = cs.backgroundColor;
  const bgItems: StyleValue[] = [];
  if (bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
    bgItems.push(item("backgroundColor", "Background", bgColor, colorLabel(bgColor)));
  }
  if (!isDefault("backgroundImage", cs.backgroundImage)) {
    bgItems.push(item("backgroundImage", "Bg Image", cs.backgroundImage));
  }

  /* --- Borders ---- */
  const borderItems: StyleValue[] = [];
  const bw = cs.borderTopWidth;
  const bs = cs.borderTopStyle;
  const bc = cs.borderTopColor;
  if (bs !== "none" && bw !== "0px") {
    borderItems.push(
      item("borderWidth", "Width", `${bw}`),
      item("borderStyle", "Style", bs),
      item("borderColor", "Color", bc, colorLabel(bc)),
    );
  }
  const br = cs.borderRadius;
  if (br !== "0px") borderItems.push(item("borderRadius", "Radius", br));

  /* --- Effects ---- */
  const effectItems: StyleValue[] = [];
  if (!isDefault("opacity", cs.opacity)) effectItems.push(item("opacity", "Opacity", `${Math.round(parseFloat(cs.opacity) * 100)}%`));
  if (!isDefault("boxShadow", cs.boxShadow)) effectItems.push(item("boxShadow", "Shadow", cs.boxShadow));
  if (!isDefault("filter", cs.filter)) effectItems.push(item("filter", "Filter", cs.filter));
  if (!isDefault("backdropFilter", cs.backdropFilter)) effectItems.push(item("backdropFilter", "Backdrop", cs.backdropFilter));
  if (!isDefault("transform", cs.transform)) effectItems.push(item("transform", "Transform", cs.transform));
  if (!isDefault("transition", cs.transition)) effectItems.push(item("transition", "Transition", cs.transition));

  function section(label: string, items: StyleValue[]): StyleSection {
    return { label, hasNonDefault: items.length > 0, items };
  }

  return {
    layout: section("Layout", layoutFiltered),
    spacing: section("Spacing", spacingItems),
    size: section("Size", sizeItems),
    position: section("Position", posItems),
    typography: section("Typography", typoItems),
    backgrounds: section("Backgrounds", bgItems),
    borders: section("Borders", borderItems),
    effects: section("Effects", effectItems),
  };
}

/**
 * Collect the raw spacing values for the BoxModelDiagram.
 */
export function extractBoxModel(el: HTMLElement) {
  const cs = getComputedStyle(el);
  const px = (v: string) => parseInt(v, 10) || 0;
  return {
    margin: { top: px(cs.marginTop), right: px(cs.marginRight), bottom: px(cs.marginBottom), left: px(cs.marginLeft) },
    padding: { top: px(cs.paddingTop), right: px(cs.paddingRight), bottom: px(cs.paddingBottom), left: px(cs.paddingLeft) },
    border: { top: px(cs.borderTopWidth), right: px(cs.borderRightWidth), bottom: px(cs.borderBottomWidth), left: px(cs.borderLeftWidth) },
    content: { width: Math.round(el.getBoundingClientRect().width), height: Math.round(el.getBoundingClientRect().height) },
  };
}
