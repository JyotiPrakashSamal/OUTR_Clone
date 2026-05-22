# OUTR_Clone

A collaborative college team project to build a frontend clone of the official **Odisha University of Technology and Research (OUTR)** website (formerly CET Bhubaneswar). This repository consolidates our team's integration work, providing a clean, responsive web interface that matches the original university site's layout, information structure, and features.

---

## 🏛️ Project Overview

This project recreates the digital presence of OUTR. It is built as a collaborative effort using standard frontend web technologies without heavy compilation or build pipelines, ensuring it is easy to run, test, and host.

### Key Features

- **Detailed Homepage** — Dynamic sliders, news tickers, notice boards, and events listing.
- **Academics & Schools** — Dedicated sections for various departments, schools, and courses (both UG and PG).
- **Administration Portal** — Pages for governance bodies, the VC's Desk, HODs, Deans, and university committees.
- **Student Life** — Campus facilities, hostel accommodation details, and activity portals.
- **Exam & Results Management** — Sample mock interfaces for admit cards and student results search.
- **Multi-language Support (i18n)** — Localization features supporting English, Hindi, and Odia.

---

## 🛠️ Tech Stack

- **HTML5** — Page structure and semantic markup.
- **TailwindCSS (CDN)** — Utility-first styling injected via CDN script.
- **Vanilla CSS** — Custom styling overrides and local component tweaks.
- **Vanilla JavaScript** — Language translation loading, search filters, and basic DOM interactivity.
- **JSON** — Structured data for localizing site content, events, and announcements.

---

## 📁 Repository Structure

The core source files are organized inside the `Phase-1 Integration` directory:

```
OUTR_Clone/
├── Phase-1 Integration/              # Main website source folder
│   ├── index.html                    # Main landing page
│   ├── style.css                     # Global custom styles
│   ├── home.js                       # Core website logic and language switching
│   ├── social.html                   # Social media hub
│   ├── social.js                     # Social page interactive logic
│   │
│   ├── OUTR website/                 # University information pages
│   │   ├── about.html                # About the university
│   │   ├── location.html             # Campus location and Google map integration
│   │   ├── mission&vission.html      # University vision and objectives
│   │   ├── schools.html              # List of academic departments
│   │   ├── courses/                  # Individual UG & PG course sheets
│   │   ├── faculties/                # Department-wise faculty lists
│   │   └── profiles/                 # Faculty member profile cards
│   │
│   ├── Student and Event/            # Student life pages
│   │   ├── Campus_Facilities/        # Campus library, labs, and amenities
│   │   ├── Hostel/                   # Hostels list and warden contacts
│   │   └── Image/                    # Image assets for student sections
│   │
│   ├── administration/               # University governance and administration
│   │   ├── Vcdesk.html               # Vice Chancellor's desk
│   │   ├── HOD.html                  # Heads of Departments list
│   │   ├── Dean.html                 # Deans directory
│   │   ├── BOM.html                  # Board of Management listing
│   │   ├── COE.html                  # Controller of Examinations panel
│   │   ├── Antiragging.html          # Anti-ragging committee page
│   │   ├── *_commitee.html           # Various active board and committee pages
│   │   ├── Admitcard_Management.html # Mock student admit card generation
│   │   ├── Admin_result_Management.html # Mock student results query interface
│   │   └── admin_*_photo/            # Committee members photos
│   │
│   └── public/
│       └── data/                     # Dynamic translations and mock JSON data
│           ├── home.json             # Announcements and slider contents
│           └── i18n/                 # Localization dictionaries (en, hi, od)
│
├── docs/                             # Project setup and overview notes
│   ├── architecture.md
│   └── setup-guide.md
│
├── CODEOWNERS                        # Team file ownership mapping
├── CONTRIBUTING.md                   # Team collaboration guidelines
└── README.md                         # This file
```

---

## 🚀 How to Run Locally

Since this is a client-side frontend project, you do not need to install `npm` modules or run a local compilation.

### Option A: Open Directly in Browser

You can open `Phase-1 Integration/index.html` directly in any web browser to view the site structure.
_Note: Due to browser security restrictions on the `fetch()` API for local files (CORS), the multi-language switching feature requires a local server to run correctly._

### Option B: Using VS Code Live Server (Recommended)

1. Open the project in VS Code.
2. Install the **Live Server** extension.
3. Right-click `Phase-1 Integration/index.html` and select **"Open with Live Server"**.
4. The site will run locally at `http://127.0.0.1:5500/Phase-1 Integration/index.html`.

### Option C: Using Python

If you have Python installed, navigate to the project directory in your terminal and run:

```bash
cd "Phase-1 Integration"
python -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## 👥 The Development Team

We split the responsibilities of the website clone as follows:

- **Jyoti Prakash Samal** ([@JyotiPrakashSamal](https://github.com/JyotiPrakashSamal))
  - **Role**:Repository Owner
  - **Ownership**: Project setup, homepage layout, global search and translation mechanisms, and core configuration files.
- **Amrita Sahu** ([@AmritaSahu25](https://github.com/AmritaSahu25))
  - **Role**: Core Contributor
  - **Ownership**: The entire `OUTR website/` module, including department listings, UG/PG course details, location guides, and faculty profiles.
- **Rama** ([@Rama-Desk](https://github.com/Rama-Desk))
  - **Role**: Core Contributor
  - **Ownership**: The entire `administration/` module, including governance desks (VC, Deans, HODs), student admit card, results system, and committee pages.
- **Sonali Gupta** ([@sonaligupta-04047](https://github.com/sonaligupta-04047))
  - **Role**: Core Contributor
  - **Ownership**: The entire `Student and Event/` module, campus facility galleries, hostel administration info, and relevant assets.

---

## 🤝 Project Disclaimer & License

This project is proprietary and built solely for educational purposes as a coursework submission. All branding, logo assets, and textual content are owned by the **Odisha University of Technology and Research (OUTR)**.
