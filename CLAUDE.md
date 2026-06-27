# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo is a GitHub Pages site (`Kubster96.github.io` → https://kubster96.github.io) hosting **two independent static sites** behind a shared landing page:

- `/` — `index.html`: a self-contained Polish landing/menu page (inline CSS) with two cards linking to the sites below.
- `/8plus/` — Static website for the "8 Plus" language school (Szkoła Języków Obcych) in Sanok, Poland. Teaches English and German, with Cambridge exam prep (FCE, CAE). Multi-page, Polish content. **This is the main subject of the rest of this document.**
- `/skoda/` — `skoda/index.html`: a single self-contained page (a used-car inspection checklist for a Škoda Superb, Polish). All CSS is inline; only external dependency is Google Fonts. Edit it as one standalone file — it shares nothing with the 8 Plus site.

Cross-navigation: the 8 Plus navbar has a "Škoda" link (`../skoda/`); the Škoda page has a slim dark `.site-switch` bar at the top linking back to the menu (`../`) and to 8 Plus (`../8plus/`). The root menu links into both. Links between sites are relative (`../`), so they work both on GitHub Pages and when opening files locally.

There is no build step: edit HTML/CSS/JS and push to `main` to publish.

## Technology

- Hand-written HTML5, UTF-8 encoding (`<meta charset="UTF-8">` — note: an older version of this site used ISO-8859-2; it does not anymore).
- Single shared external stylesheet `css/styles.css` and single shared script `js/main.js` — no inline styles, no framework, no bundler, no package.json.
- External CDN dependencies loaded per page: Bootstrap Icons (`bootstrap-icons@1.11.3`) and Google Fonts "Inter" (imported at the top of `styles.css`).
- `exams.html` embeds an external Cambridge English script/widget.

## Development

No build, lint, or test tooling. To preview locally, open the `.html` files directly in a browser, or serve the folder (e.g. `python3 -m http.server`) so relative paths and the CDN links resolve. `.idea/` and `.claude` are gitignored.

## Architecture

The 8 Plus site lives in `8plus/` (its own `css/`, `js/`, `images/` are inside that folder, referenced via relative paths). Every page is a standalone HTML file that repeats the same chrome rather than sharing templates (no includes/partials). When changing shared UI, the change must be replicated across **all** 8 Plus page files:

- `8plus/index.html`, `8plus/contact.html`, `8plus/places.html`, `8plus/exams.html`, `8plus/zasady.html`, `8plus/standardy.html`, `8plus/zalaczniki_do_standardow.html`

Shared structure across pages:
- A `.navbar` block at the top with `.navbar-brand` (logo) and a `.navbar-toggler` button for the mobile menu. The nav list uses `.navbar-nav` / `.nav-link`.
- All pages link the same `css/styles.css` and `js/main.js`.

`js/main.js` runs on `DOMContentLoaded` and wires three behaviors by class/selector — keep markup class names in sync with it:
- `initMobileNav()` — toggles `.show` on `.navbar-nav` when `.navbar-toggler` is clicked; manages `aria-expanded`; closes on outside-click and on `.nav-link` click.
- `initSmoothScroll()` — smooth-scrolls `a[href^="#"]` anchors, offsetting by `.navbar` height.
- `initActiveNavHighlight()` — adds `.active` to the `.nav-link` whose filename matches the current page.

## Styling — design system

`css/styles.css` (~1100 lines) is organized as a design system driven by CSS custom properties in `:root`. **Use the existing variables instead of hard-coding values.** Key tokens:
- Brand colors: `--color-primary` navy `#123273`, `--color-accent` red `#D91A1A`, plus `-dark`/`-light` variants and neutral/text tokens.
- Spacing scale `--spacing-xs … --spacing-3xl`, font-size scale `--font-size-sm … --font-size-4xl`, `--radius-*`, and the Inter `--font-family`.

The site is responsive; layout is fl/grid-based (not table-based). Verify changes at mobile widths since the navbar collapses into the toggler menu.

## Conventions

- Indentation is inconsistent between files (some use 2-space, e.g. `index.html`; some use 4-space, e.g. `places.html`/`zasady.html`). Match the indentation of the file you are editing.
- Keep all page chrome (navbar, footer, CDN links) consistent across the page set when editing shared elements.
