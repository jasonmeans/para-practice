# ParaPro Practice Studio

## Overview

ParaPro Practice Studio is a static website for one learner to practice skills commonly associated with the ParaPro (1755) exam. It includes original mixed practice tests, section quizzes, adaptive weak-area review, local history tracking, trend charts, and study insights.

This project is an unofficial study aid. It is not affiliated with ETS, does not use official paid test items, and does not predict or claim an official score.

## Why this project exists

The goal is simple: make it easy to do steady, low-friction practice with original questions, then use local history to decide what to study next.

## Copyright and non-affiliation note

- This site uses original practice content created for study purposes.
- It does not copy, reproduce, or scrape official ETS paid or protected questions.
- It is not affiliated with, endorsed by, or sponsored by ETS.
- Results are study-readiness signals only, not official scores or pass guarantees.

## Features

- Full mixed practice tests with randomized question order
- Section quizzes for reading, writing, math, and classroom application
- Weak-area and missed-questions review modes
- Pause and resume for an in-progress attempt
- Detailed results with explanations and recommended focus areas
- Local attempt history stored in IndexedDB
- Score trend and section trend charts
- Study insights for strongest sections, weakest sections, recurring errors, and momentum
- JSON export and import for local history
- Responsive layout with keyboard-friendly controls
- GitHub Pages deployment via GitHub Actions

## Architecture

### Stack

- Vite
- React
- TypeScript
- Dexie for IndexedDB
- Recharts for trend charts
- Vitest for unit tests
- ESLint + Prettier

### App structure

- [`src/data/questions.ts`](/Users/jasonmeans/code/personal/para-practice/src/data/questions.ts): original question bank
- [`src/lib/quiz/engine.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/engine.ts): quiz generation and adaptive weighting
- [`src/lib/quiz/scoring.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/quiz/scoring.ts): scoring and result summaries
- [`src/lib/insights/analyze.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/insights/analyze.ts): long-term study insights
- [`src/lib/db/historyService.ts`](/Users/jasonmeans/code/personal/para-practice/src/lib/db/historyService.ts): local persistence, export, and import
- [`src/pages`](/Users/jasonmeans/code/personal/para-practice/src/pages): home, practice, history, insights, and results views

### Persistence model

Completed attempts and the current in-progress session are stored in IndexedDB. Nothing is sent to a backend service. Data stays in the current browser unless exported manually.

## Local development

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Start the dev server:

   ```bash
   npm run dev
   ```

3. Open the local Vite URL shown in the terminal.

## Testing

Run the quality checks:

```bash
npm run lint
npm run test
npm run build
```

## Deployment

The repository includes a GitHub Actions workflow at [`.github/workflows/deploy-pages.yml`](/Users/jasonmeans/code/personal/para-practice/.github/workflows/deploy-pages.yml) that:

1. installs dependencies with `npm ci`
2. runs lint
3. runs tests
4. builds the static site
5. deploys the `dist` folder to GitHub Pages on push to `main`

### Manual GitHub Pages setting

In the repository settings on GitHub:

1. Open **Settings**
2. Open **Pages**
3. Set **Source** to **GitHub Actions**

The app uses a GitHub Pages-safe base path and hash routing for static navigation.

## Data storage and privacy

- Attempts are stored only in the current browser on the current device.
- Clearing browser storage for this site removes the local history.
- Exporting history creates a JSON file you can keep as a backup.
- Importing history merges saved attempts back into local storage.

## Import/export history

Use the History page to:

- export all saved attempts and any active session as JSON
- import a previous JSON backup
- clear all local history after confirmation

## Extending the question bank

Add more records to [`src/data/questions.ts`](/Users/jasonmeans/code/personal/para-practice/src/data/questions.ts) using the existing `Question` model:

- `id`
- `section`
- `topic`
- `difficulty`
- `prompt`
- `options`
- `correctAnswer`
- `explanation`
- `tags`
- optional `scenario`

The quiz engine is already structured to use future additions for better variety and adaptive selection.

## Roadmap

- Expand the original question bank with more medium and stretch items
- Add optional printable result summaries
- Add richer import conflict handling
- Add more nuanced adaptive weighting over longer history windows

## Repository operating files

This repo also includes project control files for Codex-style execution:

- [`CLAUDE.md`](/Users/jasonmeans/code/personal/para-practice/CLAUDE.md)
- [`AGENTS.md`](/Users/jasonmeans/code/personal/para-practice/AGENTS.md)
- [`MASTER-EXECUTION.md`](/Users/jasonmeans/code/personal/para-practice/MASTER-EXECUTION.md)
- [`IMPLEMENTATION_PLAN.md`](/Users/jasonmeans/code/personal/para-practice/IMPLEMENTATION_PLAN.md)
- [`daily.md`](/Users/jasonmeans/code/personal/para-practice/daily.md)
- [`COMMS.md`](/Users/jasonmeans/code/personal/para-practice/COMMS.md)
