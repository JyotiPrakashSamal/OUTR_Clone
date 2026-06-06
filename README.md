# OUTR_Clone

A collaborative college team project to build a modern frontend clone of the official **Odisha University of Technology and Research (OUTR)** website. Upgraded from static HTML to a full React SPA with Supabase-powered dashboards, multi-language support, and Netlify deployment.

---

## 🏛️ Project Overview

This project recreates the digital presence of OUTR with a hybrid architecture — a polished static marketing homepage alongside a React-powered services portal for students, faculty, and administrators.

### Key Features

- **University Homepage** — Dynamic sliders, live AQI widget, news tickers, notice boards, event listings, and tri-lingual i18n (English, Hindi, Odia).
- **React SPA Portal** — Role-based dashboards for 8 user types (Student, Warden, Faculty Advisor, HoS, Dean Academic, Dean PGA, Controller, Super Admin).
- **File Tracking System** — Multi-step student clearance routing with PDF uploads, realtime push notifications, and 7-stage approval chain.
- **Exam Management** — Grade sheets, admit card generation, and result publication dashboards.
- **Academics & Schools** — Department pages, UG/PG course listings, faculty profiles with research publications.
- **Administration** — VC Desk, Board of Governors, Dean directory, and 6+ committee pages.
- **Social Media Hub** — Integrated platform dashboards for Facebook, Instagram, LinkedIn, and YouTube.
- **Deployment-Ready** — `netlify.toml` configured with SPA fallback routing.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + React Router v7 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 4 + Vanilla CSS |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Static Pages | HTML5 + Vanilla JS (homepage, schools, faculty profiles) |
| Testing | Vitest + React Testing Library |
| CI/CD | None |
| Hosting | Netlify (static + SPA) |

---

## 📁 Repository Structure

```
OUTR_Clone/
├── frontend/                          # Main application source
│   ├── index.html                     # Vite entry point (React SPA)
│   ├── vite.config.js                 # Vite build configuration
│   ├── netlify.toml                   # Netlify build + redirect rules
│   ├── package.json                   # Dependencies and scripts
│   ├── supabase_schema.sql            # Full database schema (run in Supabase)
│   ├── DEPLOYMENT.md                  # Netlify deployment guide
│   ├── .env.example                   # Environment variable template
│   │
│   ├── src/                           # React application source
│   │   ├── App.jsx                    # Root component with routing
│   │   ├── supabaseClient.js          # Supabase SDK initialization
│   │   ├── index.css                  # Design system tokens
│   │   ├── components/                # Shared UI (Navbar, Footer, ErrorBoundary)
│   │   ├── lib/api.js                 # Centralized API abstraction layer
│   │   └── pages/                     # All page components
│   │       ├── AuthPortal.jsx         # Login portal (8 role cards)
│   │       ├── AdminDashboard.jsx     # Super admin account provisioning
│   │       ├── WardenDashboard.jsx    # Hostel warden roster management
│   │       ├── FileTrackingDashboard.jsx  # Student clearance file system
│   │       ├── InstitutionalPages.jsx # About, Location, Vision & Mission
│   │       └── file-tracking/         # Decomposed FTD sub-components
│   │
│   └── public/                        # Static assets (copied to dist/)
│       ├── home.html                  # University marketing homepage
│       ├── home.js                    # Homepage logic + i18n switching
│       ├── social.html                # Social Media Hub page
│       ├── style.css                  # Global styles for static pages
│       ├── navbar-footer-loader.js    # Unified nav/footer injector for sub-pages
│       ├── data/                      # JSON content (home, footer, i18n locales)
│       ├── OUTR website/              # School pages, courses, faculty, images
│       ├── Student and Event/         # Campus facilities, hostel pages
│       └── administration/            # Committee pages + member photos
│
├── docs/                              # Architecture notes
├── CODEOWNERS                         # Team file ownership
├── CONTRIBUTING.md                    # Collaboration guidelines
└── README.md                          # This file
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ and npm

### Setup

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key
npm install
npm run dev
```

| URL | What it shows |
|-----|---------------|
| `http://localhost:5173/home.html` | University homepage |
| `http://localhost:5173/portal` | Login portal |
| `http://localhost:5173/about` | About OUTR (React) |

### Build & Test

```bash
npm run build    # Production bundle → dist/
npm run test     # Vitest automated tests
npm run lint     # ESLint checks
```

---

## 👥 The Development Team

- **Jyoti Prakash Samal** ([@JyotiPrakashSamal](https://github.com/JyotiPrakashSamal)) — Repository Owner. Homepage, global search, i18n, React SPA architecture, CI/CD, and deployment.
- **Amrita Sahu** ([@AmritaSahu25](https://github.com/AmritaSahu25)) — Core Contributor. `OUTR website/` module: departments, courses, location, and faculty profiles.
- **Rama** ([@Rama-Desk](https://github.com/Rama-Desk)) — Core Contributor. `administration/` module: governance desks, committees, admit cards, and results.
- **Sonali Gupta** ([@sonaligupta-04047](https://github.com/sonaligupta-04047)) — Core Contributor. `Student and Event/` module: campus facilities, hostels, and student life.

---

## 🤝 Project Disclaimer & License

This project is proprietary and built solely for educational purposes as a coursework submission. All branding, logo assets, and textual content are owned by the **Odisha University of Technology and Research (OUTR)**.
