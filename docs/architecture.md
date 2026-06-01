# Architecture Overview

## Project Type
Hybrid web application — React SPA (portal/dashboards) + static marketing site (homepage/schools/faculty).

## Tech Stack
- **React 19** — SPA components, routing, and state management
- **Vite 8** — Development server and production bundler
- **Tailwind CSS 4** — Utility-first styling (build-time via `@tailwindcss/vite`)
- **Supabase** — PostgreSQL database, Auth, Storage, and Realtime subscriptions
- **Vanilla JS** — Static homepage logic (`home.js`), i18n, AQI widget
- **HTML5 + TailwindCSS CDN** — Legacy static sub-pages (schools, faculty, committees)
- **JSON** — Content data for homepage, footer, events, and i18n translations

## Architecture Diagram
```
  Browser
    │
    ├──  /  ──────────────────→  home.html (static marketing homepage)
    │                              ├── home.js (i18n, AQI, search, events)
    │                              ├── navbar-footer-loader.js (shared nav/footer)
    │                              └── data/*.json (content + translations)
    │
    ├──  /portal, /about, etc  ──→  index.html → React SPA (Vite bundle)
    │                              ├── App.jsx (BrowserRouter + routing)
    │                              ├── pages/*.jsx (AuthPortal, dashboards, etc.)
    │                              └── supabaseClient.js → Supabase Cloud
    │
    └──  /OUTR website/*  ────→  Static HTML sub-pages (schools, faculty profiles)
                                   └── TailwindCSS CDN + custom CSS
```

## Key Design Decisions

### 1. Hybrid Static + SPA Architecture
The university marketing pages (homepage, schools, faculty) are served as static HTML for maximum performance and SEO. The authenticated portal (login, dashboards) is a React SPA with client-side routing.

### 2. Supabase as Backend
All server-side logic runs on Supabase — Auth, PostgreSQL with RLS policies, file storage, and realtime channels. No custom backend server exists.

### 3. Unified Navbar/Footer
`navbar-footer-loader.js` dynamically injects a consistent header and footer into all static sub-pages, eliminating duplication across 50+ HTML files.

### 4. JSON-driven Content
Homepage content (events, notices, footer) is stored in JSON under `public/data/`. i18n translations support English, Hindi, and Odia via `data-i18n` HTML attributes.

### 5. Netlify Hosting
`netlify.toml` configures SPA fallback routing (`/* → /index.html`) and serves the static homepage at root (`/ → /home.html`). Static files take priority over the SPA fallback.
