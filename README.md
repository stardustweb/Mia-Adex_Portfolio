# Mia Adex — Portfolio Website

A static, cinematic portfolio site for Mia Adex, AI UGC & Video Ads Creator.
Pure HTML5, CSS3 and vanilla JavaScript — no frameworks, no build step, no backend.

## Structure

```
mia-adex-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── mia-portrait.jpg   (About section portrait — Mia's supplied photo)
    ├── mia-adex-cv.pdf    (Downloadable, ATS-friendly CV)
    └── favicon.svg
```

## The CV

`assets/mia-adex-cv.pdf` is a single-column, plain-text-layer PDF (Helvetica,
no tables/columns/icons) so applicant tracking systems can parse it reliably.
It's linked from a **Download CV** button in the About section and in the
footer. To update it, edit and re-run `build_cv.py` (uses `reportlab`), or
swap in your own PDF at that same path/filename.

## Why the videos didn't show before

The most common causes of Cloudinary videos failing to preview in a static site:

1. **Missing version prefix.** Cloudinary delivery URLs need the `v` before the
   version number: `.../upload/<transform>/v1789079593/<public_id>.mp4`. A URL
   built without the `v` can silently 404.
2. **All 10 videos loading (or trying to autoplay) at once**, which browsers
   throttle or block outright, especially on mobile / data-saver mode.
3. **No `poster` image**, so a failed or slow video looks like a blank box
   instead of a loading state.

This build fixes all three: every video URL is generated with the correct
`v<version>` prefix (see `script.js`), only the hero video loads immediately,
every other clip is lazy-loaded via `IntersectionObserver` and always shows a
Cloudinary-generated poster frame first, and only one clip plays at a time.

## Customizing the video library

All 10 Cloudinary clips are declared once, at the top of `script.js`:

```js
const RAW = {
  v01: { version: "1789077811", id: "VID-20260910-WA0166" },
  ...
};

const projects = [
  { num: "01", key: "v01", title: "The Morning Hook", category: "social", type: "AI UGC · Social Ad" },
  ...
];
```

To change a title, category, hero pick, or which four clips appear in
**Featured Work**, edit the `projects` array — everything else (grids, filters,
lightbox, feed section) renders from this data automatically. Categories used
by the filter bar are: `ugc`, `product`, `lifestyle`, `commercial`, `social`.

Poster frames and optimized video delivery are generated on the fly with
Cloudinary transformations (`q_auto`, `f_auto`-style delivery, `so_` for the
poster timestamp) — nothing needs to be downloaded or re-uploaded.

## Replacing the portrait

Drop a new image at `assets/mia-portrait.jpg` (or update the `src` in the
About section of `index.html`). A 4:5 portrait crop works best.

## Deployment

This is a static site — upload the folder as-is to any of the following:

- **GitHub Pages** — push the repo, enable Pages on the `main` branch.
- **Netlify / Vercel** — drag-and-drop the folder or connect the repo; no
  build command is needed (leave the build command blank / output directory
  as `.`).
- **Cloudflare Pages** — same as above, no framework preset.
- Any ordinary static web host (upload via FTP/SFTP).

## Accessibility & performance notes

- Keyboard accessible nav, mobile menu (Esc to close, focus returns to the
  menu button) and lightbox (arrow keys to navigate, Esc to close).
- Respects `prefers-reduced-motion` — marquee and scroll reveals pause/skip.
- Videos never fight for bandwidth: only visible cards receive a `src`, and
  playback pauses the moment a card leaves the viewport.
- Swap the Google Fonts `<link>` for self-hosted fonts if you want to remove
  the external font request entirely.
