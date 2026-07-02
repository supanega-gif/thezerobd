# The Zero — Restaurant Website

Marketing site for **The Zero**, a family restaurant at the BAFWWA Shopping Complex, Dhaka.

Built with [TanStack Start](https://tanstack.com/start) (React 19 + SSR), Tailwind CSS v4, and a handful of [shadcn/ui](https://ui.shadcn.com) components. Originally scaffolded in Lovable and cleaned up here into a standard, portable project with no dependency on Lovable's editor tooling.

## Project structure

```
src/
  routes/          # One file per page (file-based routing via TanStack Router)
    __root.tsx     # Shared HTML shell, header/footer, global <head> tags
    index.tsx      # Home page
    menu.tsx       # Menu page
    about.tsx      # About page
    contact.tsx    # Contact / directions page
    sitemap[.]xml.ts  # Generates /sitemap.xml at request time
  components/
    site-header.tsx / site-footer.tsx
    reveal.tsx     # Scroll-in-view animation wrapper
    ui/            # shadcn/ui primitives (only the ones actually used are kept)
  data/menu.ts     # Menu items, prices, descriptions
  lib/
    site-config.ts # Single place to set the site's canonical domain
    utils.ts       # `cn()` class-merging helper used by ui/ components
    error-page.ts / error-capture.ts  # Branded fallback page for SSR crashes
  assets/          # Photos used across the site
  server.ts        # Cloudflare Workers-style fetch handler (SSR entry)
  start.ts         # TanStack Start server middleware config
public/            # Static files served as-is (favicon, robots.txt, llms.txt)
```

## Getting started

Requires Node 20+.

```bash
npm install
npm run dev       # http://localhost:8080
npm run build     # production build (client + SSR)
npm run preview   # preview the production build locally
npm run lint       
npm run format     # prettier --write
```

## Before going live

1. **Set your real domain** in `src/lib/site-config.ts` (`SITE_URL`). It feeds the canonical links, structured data (JSON-LD), and `/sitemap.xml`.
2. **Add a social preview image.** `src/routes/__root.tsx` has commented-out `og:image`/`twitter:image` tags — the previous ones pointed at a temporary Lovable preview link that will eventually stop working. Drop a real image in `public/` and point those tags at it.
3. Update `public/robots.txt` if you want to reference the sitemap explicitly.

## Deployment

Two deploy targets are already configured — pick whichever you end up using and you can delete the other:

- **Cloudflare Workers** — `wrangler.jsonc` + `src/server.ts`. Deploy with `npx wrangler deploy` after `npm run build`.
- **Vercel** — `vercel.json`. Note this currently has a generic SPA rewrite rule; since this is a server-rendered app, double check Vercel's TanStack Start deployment docs before relying on it as-is.

## Notes on the cleanup

This repo was simplified from the original Lovable export:
- Removed the `@lovable.dev/vite-tanstack-config` dependency — `vite.config.ts` now configures Vite directly and works outside Lovable's environment.
- Removed ~38 unused shadcn/ui components and their unused Radix/npm dependencies (only what's actually imported is kept).
- Removed the `.lovable/` metadata folder and leftover Lovable branding (Twitter handle, temporary preview-image URL).
- Centralized the site's canonical URL into one file instead of hardcoding it in five places.
