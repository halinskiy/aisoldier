import type { ElementType, ReactNode } from "react";

/**
 * GridPage - the ONE page grid container (V2). A single definition of the
 * 12-column track set, the content ceiling (--grid-max), and the outer page
 * gutter (--grid-gutter). Every section wraps its content in <GridPage> so all
 * content edges line up at 1440px. No section declares its own max-width or a
 * narrower padding; narrowing is done by which columns a child spans.
 *
 * The grid itself lives in globals.css (.grid-page). This component only applies
 * that class and lets a section pick its semantic element (section, div, footer).
 *
 * Project-local. Promote to ui-kit (section.GridPage) if a second project needs
 * the same single-grid contract.
 */
type GridPageProps = {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
};

export function GridPage({ as: Tag = "div", id, className, children }: GridPageProps) {
  return (
    <Tag id={id} className={`grid-page${className ? ` ${className}` : ""}`}>
      {children}
    </Tag>
  );
}
