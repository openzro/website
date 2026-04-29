# openzro/website

Source of [openzro.io](https://openzro.io) — the project's public landing
page. Built with [Astro](https://astro.build/) + Tailwind, deployed to
Cloudflare Pages on every push to `main`.

## Stack

- Astro 5 (static, no SSR)
- Tailwind CSS with the brand tokens from
  [the root `CLAUDE.md`](https://github.com/openzro/openzro/blob/main/CLAUDE.md)
- Geist (sans) + JetBrains Mono via Google Fonts
- Brand icon mirrored from
  [`openzro/openzro/brand/openzro-icon.svg`](https://github.com/openzro/openzro/tree/main/brand)

## Develop

```bash
npm install
npm run dev   # http://localhost:4321
```

## Build

```bash
npm run build   # output → ./dist
npm run preview
```

## Deploy

Cloudflare Pages is configured with:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20+

Apex `openzro.io` and `www.openzro.io` are wired as custom domains in the
Cloudflare Pages project.

## Brand

Brand rules live in the openZro core repo
[`CLAUDE.md`](https://github.com/openzro/openzro/blob/main/CLAUDE.md). The
TL;DR for this site:

- Always spell the project as `openZro` (capital Z in the middle, the rest
  lowercase). The middle `Z` is rendered as `<span class="text-violet-400 font-bold">Z</span>`.
- Brand primary is the Tailwind `violet-600` (light) / `violet-400` (dark).
- Sans is Geist; mono is JetBrains Mono.
- Icon comes from `/public/brand/openzro-icon.svg`. Don't redraw it inline.
