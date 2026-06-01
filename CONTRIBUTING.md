# Contributing to OUTR_Clone

Thank you for considering contributing to **OUTR_Clone**! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/OUTR_Clone.git
   cd OUTR_Clone/frontend
   ```
3. **Install dependencies:**
   ```bash
   cp .env.example .env.local
   npm install
   npm run dev
   ```
4. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/JyotiPrakashSamal/OUTR_Clone.git
   ```
5. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## How to Contribute

### 1. Find or Create an Issue
- Check existing [issues](https://github.com/JyotiPrakashSamal/OUTR_Clone/issues) before starting work
- If no issue exists for your contribution, create one first
- Wait for the issue to be assigned to you before starting

### 2. Make Your Changes
- Write clean, readable code
- Follow the [Code Style Guidelines](#code-style-guidelines)
- Test your changes in multiple browsers
- Ensure responsive design works properly

### 3. Submit a Pull Request
- Follow the [Pull Request Process](#pull-request-process)
- Link the related issue in your PR description

---

## Branch Naming Convention

Use the following prefixes for branch names:

| Prefix | Purpose | Example |
|---|---|---|
| `feature/` | New features | `feature/add-alumni-page` |
| `bugfix/` | Bug fixes | `bugfix/fix-mobile-nav` |
| `docs/` | Documentation | `docs/update-readme` |
| `style/` | Styling changes | `style/improve-footer-layout` |
| `refactor/` | Code refactoring | `refactor/modularize-home-js` |
| `hotfix/` | Critical fixes | `hotfix/broken-image-links` |

---

## Commit Message Format

We follow the **Conventional Commits** specification. Each commit message should be structured as:

```
<type>(<optional scope>): <description>

[optional body]
[optional footer]
```

### Types

| Type | Description |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. (no code change) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Maintenance tasks (build, CI, dependencies) |

### Examples

```
feat: add alumni network page
fix: resolve mobile menu not closing on link click
docs: update setup instructions in README
style: fix inconsistent indentation in style.css
refactor: extract navbar into reusable component
```

---

## Pull Request Process

1. **Update your branch** with the latest from `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push** your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Open a Pull Request** against the `main` branch

4. **Fill out the PR template** completely:
   - Describe what you changed and why
   - Link the related issue
   - Include screenshots for UI changes
   - Complete the checklist

5. **Wait for review** — at least one approval is required

6. **Address feedback** — make requested changes and push new commits

7. **Merge** — the repository owner will merge approved PRs

### PR Checklist
- [ ] My code follows the project's code style
- [ ] I have tested my changes in Chrome, Firefox, and mobile view
- [ ] I have run `npm run build` and it succeeds without errors
- [ ] I have updated documentation if needed
- [ ] My changes don't break existing functionality
- [ ] I have linked the related issue

---

## Code Style Guidelines

### HTML
- Use **semantic HTML5** elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
- Use **2-space indentation**
- Include `alt` attributes on all `<img>` elements
- Use descriptive `id` and `class` names
- Keep lines under **120 characters** where possible

### CSS
- Use **2-space indentation**
- Use **lowercase with hyphens** for class names (e.g., `nav-link`, `hero-section`)
- Group related properties together
- Add comments for non-obvious sections
- Prefer TailwindCSS utilities; use custom CSS only when needed

### JavaScript / React (JSX)
- Use **2-space indentation**
- Use `const` and `let` (never `var`)
- Use **camelCase** for variables and functions
- Use **PascalCase** for React components and class names
- Add JSDoc comments for functions
- Handle errors gracefully
- React components go in `frontend/src/pages/` or `frontend/src/components/`

### File Naming
- React components: **PascalCase** (e.g., `AuthPortal.jsx`, `WardenDashboard.jsx`)
- Static HTML files: **camelCase** or **PascalCase** (match existing patterns)
- CSS files: **camelCase** with descriptive names
- JavaScript files: **camelCase**
- Image files: **descriptive names** with hyphens (e.g., `campus-aerial-view.jpg`)

---

## Reporting Issues

### Bug Reports
Use the **Bug Report** issue template. Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Feature Requests
Use the **Feature Request** issue template. Include:
- Clear description of the feature
- Why it would be useful
- Any mockups or examples

---

## Questions?

If you have questions about contributing, open a [Discussion](https://github.com/JyotiPrakashSamal/OUTR_Clone/discussions) or reach out to the repository owner.

---

Thank you for helping make OUTR_Clone better! 🎓
