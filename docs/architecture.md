# Architecture Overview

## Project Type
Static front-end website (no build step required).

## Tech Stack
- **HTML5** — Page structure and content
- **TailwindCSS (CDN)** — Utility-first styling via `<script src="https://cdn.tailwindcss.com">`
- **Vanilla CSS** — Custom component styles (`style.css` + page-specific CSS files)
- **Vanilla JavaScript** — Interactivity, i18n, data loading
- **JSON** — Static data storage for content and translations

## Data Flow
```
JSON files (public/data/)
        ↓
   JavaScript (home.js)
        ↓
   DOM Manipulation
        ↓
   Rendered HTML
```

## Key Design Decisions

### 1. CDN-based TailwindCSS
TailwindCSS is loaded via CDN (`cdn.tailwindcss.com`) rather than installed as a build dependency. This eliminates the need for Node.js, npm, or any build tooling — contributors can start working immediately.

### 2. JSON-driven Content
Homepage content (events, notices, footer data) is stored in JSON files under `public/data/`. This separates content from presentation and makes future backend integration easier.

### 3. Internationalization (i18n)
Translation files are stored as JSON in `public/data/i18n/` with support for:
- English (`en.json`)
- Hindi (`hi.json`)
- Odia (`od.json`)

The `data-i18n` HTML attribute marks translatable elements, and `home.js` handles language switching.

### 4. Folder Organization
The project is organized by feature/section rather than by file type:
- `OUTR website/` — University information pages
- `Student and Event/` — Student life content
- `administration/` — Admin and governance pages

## Future Architecture Considerations
- Migrate from CDN TailwindCSS to a build-based setup for production optimization
- Consider a static site generator (e.g., 11ty, Astro) for templating shared components (navbar, footer)
- Add a backend API for dynamic data (notices, events, results)
