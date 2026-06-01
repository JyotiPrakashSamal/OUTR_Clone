# Developer Setup Guide

> **Production deploy:** see [`frontend/DEPLOYMENT.md`](../frontend/DEPLOYMENT.md) for Netlify and Supabase.

## Prerequisites

| Tool | Required | Purpose |
|---|---|---|
| Node.js 18+ | ✅ | Vite dev server and builds |
| Git | ✅ | Version control |
| Supabase project | For portal testing | Auth, file tracking, grades |

## Quick start

```bash
cd frontend
cp .env.example .env.local
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

- **Homepage:** http://localhost:5173/home.html  
- **Portal:** http://localhost:5173/portal  
- **Root `/`:** redirects to `home.html`

## Supabase (one-time per project)

Run `frontend/supabase_schema.sql` in the Supabase SQL Editor. You do **not** re-run this on every deploy — only when creating a new database or applying schema changes.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development |
| `npm run build` | Production build → `dist/` |
| `npm run test` | Vitest |
| `npm run lint` | ESLint |
