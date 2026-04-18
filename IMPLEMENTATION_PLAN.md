# Implementation Plan

# Chosen Stack

- Vite
- React
- TypeScript
- Supabase Auth + Postgres
- Recharts for trends
- Vitest + Testing Library for tests
- ESLint + Prettier

# Why This Stack

- Vite gives a clean static build path and simple GitHub Pages deployment.
- React + TypeScript keeps the UI modular without adding framework complexity.
- Supabase keeps learner history on the backend so saved sessions can resume across browsers and devices.
- Recharts handles responsive charts with minimal custom chart code.
- Vitest integrates naturally with Vite and supports fast unit tests.

# Architecture

- `src/data`: original question bank and static content
- `src/lib/quiz`: quiz generation, scoring, and adaptive selection logic
- `src/lib/insights`: performance summaries and recommendations
- `src/lib/backend`: backend sync, import/export, and record mapping
- `src/lib/supabase`: client setup
- `src/lib/theme`: system-synced theme handling
- `src/components`: reusable UI pieces
- `src/pages`: route-level screens for home, practice, history, and insights

# Data Model

Core records:

- `Question`
- `Attempt`
- `AttemptAnswer`
- `SectionScore`
- `ActiveSession`

Question fields:

- id
- section
- topic
- difficulty
- prompt
- options
- correctAnswer
- explanation
- tags
- scenario

Attempt fields:

- id
- startedAt
- completedAt
- mode
- title
- questionIds
- answers
- scoreSummary
- weakTopics
- missedQuestionIds
- durationSeconds

# Persistence Strategy

- Store completed attempts and active sessions in Supabase tables protected with row-level security.
- Keep import/export in JSON for portability and backups.
- Require sign-in so history and active sessions can be retrieved on another device.
- Support pause/resume by syncing the active session after each answer change and timer checkpoint.

# Deployment Strategy

- Use Vite static build output.
- Configure `base` for GitHub Pages using the repository name in production.
- Inject Supabase browser credentials at build time through local env vars and GitHub Actions secrets.
- Add a GitHub Actions workflow that installs dependencies, runs lint/tests/build, uploads the build artifact, and deploys to GitHub Pages on push to `main`.

# Testing Strategy

- Unit tests for:
  - scoring logic
  - quiz randomization and weak-area weighting
  - insight generation
  - backend persistence helpers and import/export validation
- Add light component-level tests only for high-risk behavior if needed.

# Milestone Plan

1. Operating files and repo rules
2. Static app foundation and routes
3. Question bank and assessment engine
4. Persistence, history, trends, and insights
5. Deployment and documentation
6. Verification and release commits

# Initial Assumptions

- The frontend should stay static, with backend sync delegated to Supabase.
- The repository name `para-practice` will be used for GitHub Pages base pathing.
- A focused but sufficiently varied seed bank is better than a huge low-quality bank.
- Adaptive behavior will be lightweight: weak domains get higher selection weight rather than a complex mastery engine.
- Lightweight sign-in is acceptable because cross-device resume requires a persistent learner identity.
