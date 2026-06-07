# OUTR Portal - Netlify Deployment Guide

## What gets deployed

Only the **`frontend/`** folder is built and published. Netlify serves the Vite output directory **`frontend/dist`**, which includes:

| Content | Examples |
|---------|----------|
| React SPA | `index.html`, JS/CSS bundles - portal, dashboards, institutional React pages |
| Static marketing site | `home.html`, `social.html`, school pages, committee HTML |
| Assets | Images, JSON data, `style.css` |

You do **not** deploy `Phase-1 Integration/` (legacy copy; removed from the active tree) or Supabase SQL files to Netlify. SQL runs in the Supabase cloud dashboard, not on Netlify.

---

## One-time Netlify setup

1. Connect the GitHub repo at [app.netlify.com](https://app.netlify.com).
2. **Site settings → Build & deploy:**
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. **Environment variables** (Site settings → Environment variables):

   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```

4. Deploy. `netlify.toml` in `frontend/` already configures:
   - `/` → `home.html` (university homepage)
   - SPA fallback → `index.html` for React routes (`/portal`, `/about`, etc.)

---

## Supabase - run once, not on every deploy

Database schema is **not** executed by Netlify. You configure Supabase **once** per project (or when schema changes).

### First-time setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**.
3. Paste and run the full script: **`frontend/supabase_schema.sql`**
   - Creates `profiles`, `file_tracking`, `students_hostel`, `student_grades`, `student_admit_cards`, storage bucket, RLS policies, auth trigger.
4. If you already had an older database, also run **`frontend/grades_admit_cards_patch.sql`** (policy lockdown only).
5. **Authentication → URL configuration:** add your Netlify URL, e.g. `https://your-site.netlify.app`.
6. For development, you may disable **Confirm email** under Auth providers, or confirm users manually.
7. Create the **first admin** in Supabase Auth (Dashboard → Users → Add user) with metadata:
   ```json
   { "role": "admin", "name": "Super Admin" }
   ```
   The trigger creates a matching `profiles` row.
8. Log in at `/portal` as admin and use **Admin Dashboard** to provision other desks.

### When do you run SQL again?

| Situation | Action |
|-----------|--------|
| New Netlify deploy / code push | **Nothing** - same Supabase project, same data |
| New teammate / new environment | Point `.env` / Netlify env vars to the **same** or a **new** Supabase project; if new project, run `supabase_schema.sql` once |
| You change tables or RLS in code | Run an **incremental** migration SQL in Supabase (update `supabase_schema.sql` in repo for documentation) |

---

## Local development

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key
npm install
npm run dev
```

- Homepage: http://localhost:5173/home.html  
- Portal: http://localhost:5173/portal  
- Root `/` redirects to `home.html` in dev via React `HomeRedirect` (production uses Netlify redirect).

---

## Teammate testing checklist

- [ ] Netlify site live with env vars set  
- [ ] `supabase_schema.sql` executed on shared Supabase project  
- [ ] At least one admin user exists  
- [ ] Auth redirect URLs include the Netlify domain  
- [ ] Visit `/` - should show university homepage  
- [ ] Visit `/portal?role=student` - desk pre-selected  
- [ ] Placeholder links (Careers, Tenders, etc.) open **Coming soon** page  

### Dev login shortcuts (after users exist in Supabase)

On `/portal`, click the logo **5 times** to reveal quick-fill credentials (see `AuthPortal.jsx`).

---

## CI note

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci`, lint, test, and build inside `frontend/`. Ensure `package-lock.json` is committed.
