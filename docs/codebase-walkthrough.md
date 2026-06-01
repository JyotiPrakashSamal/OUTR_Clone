# 🎓 Codebase Walkthrough & Technical Guide

Welcome to the technical guide of the **OUTR_Clone** codebase! This document provides a detailed walkthrough of the project's technical architecture, explaining **why** specific technologies are used, **how** the core features (such as internationalization and API widgets) work, and their current **architectural limitations**.

---

## 🏛️ 1. Core Architecture Design

The project is designed as a **hybrid web application** — a static marketing homepage with a React SPA portal backed by Supabase.

### Why This Stack?
- **High Accessibility:** Built entirely with pure **HTML5, TailwindCSS (CDN), Vanilla CSS, and Vanilla JavaScript**.
- **No Build Complexity:** There is zero compilation, transpilation, or packaging pipeline (no `Webpack`, `Vite`, or `Node.js` required). 
- **Low Setup Overhead:** Teammates can contribute immediately by editing standard HTML, CSS, or JS files and opening them directly or via a simple local server.

### Technical Overview
```
                   +------------------------+
                   |  JSON Data Store       |
                   |  - public/data/i18n/   | <-- (en.json, hi.json, od.json)
                   |  - public/data/home/   | <-- (home.json notices & events)
                   +------------------------+
                               |
                               | (HTTP fetch calls)
                               v
                   +------------------------+
                   |  Vanilla JavaScript    |
                   |  - home.js             | <-- (Core translation, dynamic loading,
                   |  - social.js           |      AQI polling, global search engine)
                   +------------------------+
                               |
                               | (DOM Modification)
                               v
                   +------------------------+
                   |  Rendered DOM Layout   | <-- (Dynamic local content with Tailwind)
                   +------------------------+
```

---

## 🌐 2. Internationalization (i18n) Deep-Dive

The project implements a custom client-side internationalization (i18n) framework in `home.js`.

### How it Works
1. **Marking Translatable Elements:** Instead of hardcoding text, translatable elements in HTML are marked with custom attributes:
   - `data-i18n="translation.key"` for text or inner HTML content.
   - `data-i18n-placeholder="placeholder.key"` for input placeholders.
   
   *Example:*
   ```html
   <span data-i18n="common.lastUpdated">Last updated</span>
   ```

2. **Language State Management:**
   - On page load, JavaScript reads the user's preferred language from `localStorage` using the key `outr_ui_language_v1`.
   - If no preference exists, it defaults to `"en"`.
   - The document-level `<html lang="...">` attribute is updated to match.

3. **HTTP Fetch & Caching:**
   - JavaScript fetches the corresponding language dictionary file from `/public/data/i18n/[lang].json` (e.g. `hi.json` for Hindi, `od.json` for Odia).
   - An in-memory cache (`i18nCache`) stores the loaded language packs. If the user toggles between languages, subsequent swaps read instantly from memory without triggering additional network requests.

4. **DOM Parsing & Fallback Mechanism:**
   - JavaScript queries all `[data-i18n]` and `[data-i18n-placeholder]` nodes.
   - It replaces their contents/placeholders with the matching translation values from the dictionary.
   - **Fallback:** If a translation key is missing in the chosen language (e.g., Odia or Hindi), the framework automatically falls back to the English (`en.json`) dictionary value, preventing empty elements.

### Limitations of this custom i18n
- > [!WARNING]
  > **CORS Restrictions:** Since the browser must fetch JSON files via `fetch()`, trying to open the files using a direct file protocol (`file:///`) in the browser will cause security blocks (CORS errors) on the language packs. A local HTTP server is strictly required.

---

## 🍃 3. Live Air Quality Index (AQI) Widget

Located in the footer, this component provides real-time ambient information for the university's techno-campus in Bhubaneswar.

### Mechanics & Workings
1. **Geolocation Coordinates:** The widget utilizes the fixed geographic coordinates of Bhubaneswar:
   - `lat: 20.2961`, `lon: 85.8245`
2. **API Endpoint:** On loading, it sends an asynchronous HTTP GET request to the Open-Meteo Air Quality API:
   ```
   https://air-quality-api.open-meteo.com/v1/air-quality?latitude=20.2961&longitude=85.8245&current=us_aqi,pm2_5
   ```
3. **Decoded States:** The retrieved American AQI rating is matched against standard index ranges:
   - `0 - 50`: Good (Green `#16a34a`)
   - `51 - 100`: Moderate (Yellow-Green `#ca8a04`)
   - `101 - 150`: Poor (Orange `#dc2626`)
   - `151 - 200`: Unhealthy (Red `#9f1239`)
   - `201 - 300`: Very Unhealthy (Purple `#6b21a8`)
   - `> 300`: Hazardous (Dark Red `#7f1d1d`)
4. **Caching & Polling:**
   - The results are cached in `localStorage` under `outr_live_aqi_v1` to minimize network overhead on page navigation.
   - The cache expires after a custom background interval (`AQI_POLL_INTERVAL_MS = 15 minutes`), at which point a fresh API call is scheduled.
   - Fallback text displays gracefully if the client has no internet connection.

---

## 🔍 4. Global Search Engine

The global search panel provides interactive navigation across the entire homepage and integrated sub-pages.

### Key Mechanics
- **Event Listeners:** Listens for keyboard triggers (e.g., `/` key or button click) to overlay the search overlay.
- **Search Corpus:** Scrapes and matches index queries across dynamic notices, scheduled events, directory links, and DOM navigation blocks.
- **Keyboard Traversal:** Fully supports keyboard actions:
  - `ArrowUp` / `ArrowDown` to navigate matching suggestions.
  - `Enter` to open/activate selected links.
  - `Escape` to quickly close the panel.
- **History Tracking:** Stores recent searches in `localStorage` so users can quickly re-visit previous queries.

---

## 🏢 5. Administrative Modules

The governance features are split between static pages and React dashboards:

### React Dashboards (Supabase-backed)
- **Admin Dashboard** (`AdminDashboard.jsx`) — Account provisioning for all university roles.
- **File Tracking** (`FileTrackingDashboard.jsx`) — 7-stage clearance approval chain with PDF uploads and realtime notifications.
- **Warden Dashboard** (`WardenDashboard.jsx`) — Hostel room allocation and student roster management.
- **Exam Management Desk** (`ExamManagementDesk.jsx`) — Grade sheet upload, admit card generation, and result publication.

### Static Committee Pages
- Committee HTML pages under `frontend/public/administration/` display governance body members with photos and designations.

---

## ⚠️ 6. Current Architecture Notes

Many of the original limitations have been addressed:

### ✅ Resolved
- **Code Duplication** — `navbar-footer-loader.js` now dynamically injects a unified header/footer into all static sub-pages. Editing one file updates every page.
- **TailwindCSS CDN Performance** — The React SPA uses build-time Tailwind via `@tailwindcss/vite`. Only the legacy static sub-pages still use the CDN version.
- **No Server Database** — Supabase provides PostgreSQL with Row Level Security, Auth, file storage, and realtime subscriptions. File tracking, grades, hostel management, and admit cards are all database-backed.

### ⚠️ Remaining
- **Static sub-pages** (schools, faculty profiles, committee pages) are still standalone HTML files. Migrating them to React components would eliminate the last CDN Tailwind dependency.
- **Directory names with spaces** (`OUTR website/`, `Student and Event/`) work but are unconventional for web projects.

