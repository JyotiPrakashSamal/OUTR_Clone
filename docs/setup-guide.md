# Developer Setup Guide

## Prerequisites

| Tool | Required | Purpose |
|---|---|---|
| Modern browser | ✅ | Chrome, Firefox, or Edge |
| Git | ✅ | Version control |
| Code editor | ✅ | VS Code recommended |
| Live Server | Optional | Auto-reload during development |

## Step 1: Clone the Repository

```bash
git clone https://github.com/JyotiPrakashSamal/OUTR_Clone.git
cd OUTR_Clone
```

## Step 2: Open the Project

Open the project folder in your code editor:
```bash
code .
```

## Step 3: Run Locally

### Option A: Direct File Open
Simply open `Phase-1 Integration/index.html` in your browser.

### Option B: VS Code Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `Phase-1 Integration/index.html`
3. Select **"Open with Live Server"**
4. The site opens at `http://127.0.0.1:5500`

### Option C: Python HTTP Server
```bash
cd "Phase-1 Integration"
python -m http.server 8000
# Open http://localhost:8000
```

## Step 4: Start Contributing

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test in multiple browsers and screen sizes

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: describe your change"
   git push origin feature/your-feature-name
   ```

5. Open a Pull Request on GitHub

## Project Conventions

- **Indentation**: 2 spaces (enforced by `.editorconfig`)
- **Line endings**: LF (enforced by `.gitattributes`)
- **Commit format**: Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Branch naming**: `feature/`, `bugfix/`, `docs/`, `style/`

## Troubleshooting

### Images not loading?
Some images reference external URLs (e.g., `outr.ac.in`). Ensure you have an internet connection.

### Styles look broken?
TailwindCSS is loaded via CDN. Check your internet connection and browser console for errors.

### i18n not working?
Language files are loaded via `fetch()` from JSON. This requires a local server (Option B or C above) — direct file open may block fetch requests due to CORS.
