# booquarium — Architecture

## Stack
- Next.js 15, App Router, React 19, TypeScript strict
- Tailwind CSS v4
- Framer Motion 12
- Lenis (root layout)
- {{additions / deviations}}

## Folder structure
```
src/
  app/
    layout.tsx        # Lenis wired here, Inspector imported (dev only)
    page.tsx          # Landing page composition
    globals.css       # @import of ui-kit/tokens.css + @theme overrides
  components/
    {{sections live here — promote reusable ones to ui-kit/}}
  lib/
    cn.ts             # clsx + tailwind-merge
```

## Routing
- Single page landing at `/`
- {{additional routes if any}}

## Build pipeline
```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Deployment
- Target: {{Vercel / static export / handoff to Webflow only}}

## Imports from ui-kit
List which kit components this project imports. Update when a new one is added.
- `@/ui-kit/components/...`

## Dev-only Inspector
Inspector overlay is imported in `app/layout.tsx` behind `process.env.NODE_ENV === 'development'`. Cmd+click any element to see `data-component`, `data-source`, `data-tokens`.
