## Calculator App — Clean README

**Project:** Calculator App 

A small, responsive calculator built with Next.js + TypeScript. It demonstrates expression parsing, postfix evaluation.

- **Expression parser & evaluator** supporting: `+ - * / ^` operators, `√` (square root), `log` (base 10), `ln` (natural log), `%`, factorial `!`, and implicit multiplication (e.g. `5√49` → `5*√49`).
- **UX features:** AC (clear all), C (backspace), on-screen keypad, formatted superscript display for exponents.
- **Tech:** Next.js (App Router), React, TypeScript, Tailwind-style utility classes.

**Key files**
- [app/calculate.tsx](app/calculate.tsx) — calculator UI, tokenization and evaluation logic.
- [app/page.tsx](app/page.tsx) — app entry / layout.
- [app/globals.css](app/globals.css) — basic styles and theme variables.

## Getting started

Prerequisites: Node.js (16+ recommended) and npm.

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Build for production:

```bash
npm run build
npm start
```

## Usage examples
- `72*9/2+5√49` → `359`
- `2(3+4)` → `14` (implicit multiplication supported)





