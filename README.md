# Rumeira v4

High-converting, SEO-optimized marketing homepage for Rumeira: digital marketing, website design, and AI workflow systems.

## Stack

- **Framework:** Astro 5 (static-first, partial hydration)
- **Styling:** Tailwind CSS + Clash Display / Satoshi
- **Interactivity:** Single React component for the scroll animation (`client:visible`)
- **Hosting:** Vercel-ready (`vercel.json` included)

## Run

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Scroll animation frames

The hero scroll section in `src/components/ScrollAnimation.jsx` loads an image sequence from `/public/frames/`. Drop in 120 WebP files named `frame_0001.webp` through `frame_0120.webp`. See `public/frames/README.txt` for an ffmpeg recipe to generate them from the supplied video.

The component:
- Preloads frames into `Image()` objects
- Renders to a `<canvas>` for smooth GPU-accelerated draws
- Uses scroll position to compute the target frame, eased toward each animation frame
- Updates overlay text in 5 stages keyed to scroll progress
- Lazy-hydrates with `client:visible` so the bundle does not block initial paint

## Brand

- Primary: `#987622` (gold)
- Secondary: `#BC922C`
- Accent: `#E0C67B`
- Backgrounds: white (`#FFFFFF`), black (`#000000`)
- Headings: Clash Display 500
- Body: Satoshi 400 / 500 / 700

## File map

```
src/
  components/  Hero, Nav, Services, ScrollAnimation, WhyRumeira, Results, Process, CTA, Footer
  layouts/     BaseLayout
  pages/       index
  styles/      global.css (Tailwind + @font-face)
public/
  fonts/       woff2 files (Clash Display, Satoshi)
  frames/      drop frame_0001.webp...frame_0120.webp here
```

## SEO

- Single H1 per page, semantic H2/H3 hierarchy
- Open Graph + Twitter card metadata
- JSON-LD Organization schema in `BaseLayout.astro`
- Sitemap via `@astrojs/sitemap`
- Font preloading, `compressHTML`, inlined critical CSS
- Preview-only React hydrated on visibility, all other content pre-rendered
