/**
 * Suggest a Client-First convention class name for the selected element.
 *
 * Client-First (Finsweet) uses `block_element` with lowercase + underscores:
 *   section_hero, heading_xlarge, button_primary, image_card, text_body.
 *
 * If `data-component` is present, it's the primary signal (most specific).
 * Otherwise, infer from `tagName` + text content.
 */
export function suggestClassName(
  tagName: string,
  component: string | null,
  textSnippet: string,
): string {
  const tag = tagName.toLowerCase();

  // Use data-component as primary signal
  if (component) {
    const kebab = component
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replace(/-/g, "_");

    // Map known patterns to Client-First blocks
    if (/section|hero|about|approach|services|case|testimonial|process|faq|contact|footer|banner/i.test(component)) {
      return `section_${kebab}`;
    }
    if (/header/i.test(component)) return `layout_${kebab}`;
    if (/button/i.test(component)) return `button_${kebab}`;
    if (/card/i.test(component)) return `card_${kebab}`;
    if (/image/i.test(component)) return `image_${kebab}`;
    if (/eyebrow|label/i.test(component)) return `label_${kebab}`;
    if (/divider/i.test(component)) return `divider_${kebab}`;
    if (/avatar/i.test(component)) return `avatar_${kebab}`;
    if (/grid|row|list/i.test(component)) return `layout_${kebab}`;
    if (/logo/i.test(component)) return `brand_${kebab}`;
    return kebab;
  }

  // Fall back to tagName heuristics
  switch (tag) {
    case "section":
      return "section_block";
    case "nav":
      return "nav_bar";
    case "footer":
      return "footer_block";
    case "header":
      return "header_block";
    case "h1":
      return "heading_xlarge";
    case "h2":
      return "heading_large";
    case "h3":
      return "heading_medium";
    case "h4":
      return "heading_small";
    case "h5":
      return "heading_xsmall";
    case "h6":
      return "heading_xxsmall";
    case "p": {
      const len = textSnippet.length;
      if (len < 40) return "text_caption";
      if (len < 120) return "text_body";
      return "text_rich";
    }
    case "a":
      return "link_text";
    case "button":
      return "button_primary";
    case "img":
      return "image_block";
    case "ul":
    case "ol":
      return "list_block";
    case "li":
      return "list_item";
    case "input":
    case "textarea":
    case "select":
      return "form_input";
    case "form":
      return "form_block";
    case "span":
      return "text_span";
    case "svg":
      return "icon_block";
    default:
      return "div_block";
  }
}
