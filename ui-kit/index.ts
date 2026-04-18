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
