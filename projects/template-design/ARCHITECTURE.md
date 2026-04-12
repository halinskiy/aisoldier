# template-design — Architecture

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS v4 (via `@tailwindcss/postcss`) — no `tailwind.config.js`, all tokens live in `@theme` blocks in CSS
- Framer Motion 12
- Lenis 1.1 (smooth scroll, wired at root via `ReactLenis`)
- `clsx` + `tailwind-merge` via `cn()` util
- `zod` + `react-hook-form` reserved for the Section 11 contact form

## Folder structure
```
projects/template-design/
  package.json          # pins next@15, react@19, tailwindcss@4, framer-motion@12, lenis
  tsconfig.json         # path aliases: @/* → src/*, @kit/* → ../../ui-kit/*, @content/* → ./content/*
  next.config.ts        # experimental.externalDir = true (so src/ can import the kit)
  postcss.config.mjs    # @tailwindcss/postcss
  tokens.css            # warm palette + #FF512A accent + clamp type scale (loaded after kit tokens)
  content/              # copy.json, testimonials.json, stats.json, faq.json
  src/
    app/
      globals.css       # imports kit tokens + project tokens + font-var redirect
      layout.tsx        # next/font IBM Plex Sans+Serif, LenisProvider, Inspector (dev)
      page.tsx          # landing composition
    components/
      providers/
        LenisProvider.tsx   # "use client", ReactLenis wrapper
      sections/
        Nav.tsx             # Section 0 — thin wrapper around @kit NavSticky
    lib/
      cn.ts               # re-exports @kit/lib/cn
```

## Path aliases
- `@/*` → `src/*` (project)
- `@kit/*` → `../../ui-kit/*` (shared kit)
- `@content/*` → `./content/*` (JSON copy dossiers)

## Routing
- Single landing page at `/`. Style Guide route may land later under `/style-guide` for handoff reference.

## Build pipeline
```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run typecheck
```

## Deployment target
Handoff to Webflow — this React build is the reference implementation, not production. Running it locally is the primary way the Webflow developer will verify behaviour.

## Imports from ui-kit
- `@kit/components/devtools/Inspector` → root layout
- `@kit/components/nav/NavSticky` → `src/components/sections/Nav.tsx`
- `@kit/lib/cn` → `src/lib/cn.ts`
- `@kit/lib/motion` → consumed transitively by NavSticky mobile overlay

## Dev-only Inspector
Inspector overlay is imported in `app/layout.tsx` behind `process.env.NODE_ENV === 'development'`. Cmd+click any element to see `data-component`, `data-source`, `data-tokens`. Every kit and section component carries these three attributes on its root.

