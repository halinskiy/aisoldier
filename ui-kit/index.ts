/*
 * Aisoldier UI Kit — public surface.
 *
 * Components are added here the moment they land in `components/`. Anything
 * still in the roadmap (see INDEX.md "Must-have v1") is NOT re-exported until
 * the file actually exists — doing otherwise breaks projects that type-check.
 */

export { cn } from "./lib/cn";
export { motionPresets, EASE_OUT, EASE_MINIMIZE, durations } from "./lib/motion";

export { Inspector } from "./components/devtools/Inspector";

export { NavSticky } from "./components/nav/NavSticky";
export type { NavStickyProps, NavLink, NavCta } from "./components/nav/NavSticky";

export { LogoWave } from "./components/brand/LogoWave";
export type { LogoWaveProps } from "./components/brand/LogoWave";

export { Logo3mpq } from "./components/brand/Logo3mpq";
export type { Logo3mpqProps } from "./components/brand/Logo3mpq";

export { EyebrowLabel } from "./components/section/EyebrowLabel";
export type { EyebrowLabelProps } from "./components/section/EyebrowLabel";

export { AvatarStack } from "./components/section/AvatarStack";
export type { AvatarStackProps, AvatarStackItem } from "./components/section/AvatarStack";

export { SectionHeader } from "./components/section/SectionHeader";
export type { SectionHeaderProps } from "./components/section/SectionHeader";

export { SectionDivider } from "./components/section/SectionDivider";
export type { SectionDividerProps } from "./components/section/SectionDivider";

export { ImageCard } from "./components/section/ImageCard";
export type { ImageCardProps, ImageCardImage } from "./components/section/ImageCard";

export { ImageCardGrid } from "./components/section/ImageCardGrid";
export type { ImageCardGridProps, ImageCardGridCard } from "./components/section/ImageCardGrid";

export { BrowserFrame } from "./components/section/BrowserFrame";
export type { BrowserFrameProps } from "./components/section/BrowserFrame";

export { StickyFeatureList } from "./components/section/StickyFeatureList";
export type {
  StickyFeatureListProps,
  StickyFeatureItemData,
} from "./components/section/StickyFeatureList";

export { BlurbWall, BlurbCard } from "./components/section/BlurbWall";
export type { BlurbWallProps, BlurbData } from "./components/section/BlurbWall";

export { FooterEditorial } from "./components/section/FooterEditorial";
export type {
  FooterEditorialProps,
  FooterLink,
} from "./components/section/FooterEditorial";

export { BlurReveal } from "./components/motion/BlurReveal";
export type { BlurRevealProps } from "./components/motion/BlurReveal";

export { SplitText } from "./components/motion/SplitText";
export type { SplitTextProps } from "./components/motion/SplitText";

export { Button } from "./components/ui/Button";
export type { ButtonProps } from "./components/ui/Button";

export { TextLink } from "./components/ui/TextLink";
export type { TextLinkProps } from "./components/ui/TextLink";

export { SegmentedToggle } from "./components/ui/SegmentedToggle";
export type {
  SegmentedToggleProps,
  SegmentedToggleOption,
} from "./components/ui/SegmentedToggle";

export { Badge } from "./components/ui/Badge";
export type { BadgeProps } from "./components/ui/Badge";

export { Input } from "./components/ui/Input";
export type { InputProps } from "./components/ui/Input";

export { Textarea } from "./components/ui/Textarea";
export type { TextareaProps } from "./components/ui/Textarea";

export { Select } from "./components/ui/Select";
export type { SelectProps, SelectOption } from "./components/ui/Select";

export { LogoBelt } from "./components/section/LogoBelt";
export type { LogoBeltProps, LogoBeltItem } from "./components/section/LogoBelt";

export { FAQAccordion, FAQItem } from "./components/section/FAQAccordion";
export type {
  FAQAccordionProps,
  FAQItemData,
} from "./components/section/FAQAccordion";

export { HeroPinned } from "./components/section/HeroPinned";
export type { HeroPinnedProps } from "./components/section/HeroPinned";

export { BentoGrid, BentoCell } from "./components/section/BentoGrid";
export type {
  BentoGridProps,
  BentoCellProps,
  BentoCellSpan,
} from "./components/section/BentoGrid";

export { MetricsBar } from "./components/section/MetricsBar";
export type { MetricsBarProps, MetricItem } from "./components/section/MetricsBar";

export { CookieConsent } from "./components/consent/CookieConsent";
export type { CookieConsentProps } from "./components/consent/CookieConsent";
