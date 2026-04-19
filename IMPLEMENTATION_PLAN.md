# Implementation Plan

# Chosen Stack

- Vite
- React
- TypeScript
- Node local backend for ready-to-run storage
- Supabase Auth + Postgres for hosted deployment
- Recharts for trends
- Vitest + Testing Library for tests
- ESLint + Prettier

# Why This Stack

- Vite gives a clean static build path and simple GitHub Pages deployment.
- React + TypeScript keeps the UI modular without adding framework complexity.
- A bundled Node backend makes the app usable immediately without external provisioning.
- Supabase remains the hosted path when the app needs internet-facing access and managed Postgres storage.
- Recharts handles responsive charts with minimal custom chart code.
- Vitest integrates naturally with Vite and supports fast unit tests.

# Architecture

- `src/data`: original question bank and static content
- `src/lib/quiz`: quiz generation, scoring, and adaptive selection logic
- `src/lib/insights`: performance summaries and recommendations
- `src/lib/backend`: auth routing, persistence, import/export, and record mapping
- `src/lib/supabase`: hosted client setup
- `src/lib/theme`: system-synced theme handling
- `src/components`: reusable UI pieces
- `src/pages`: route-level screens for home, practice, history, and insights
- `server`: local account and history API plus static asset hosting

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

- Store completed attempts and active sessions in the local backend by default so the app works out of the box.
- Switch to Supabase tables protected with row-level security when hosted credentials are present.
- Keep import/export in JSON for portability and backups.
- Require sign-in so history and active sessions stay bound to a learner account.
- Support pause/resume by saving the active session after each answer change and timer checkpoint.

# Deployment Strategy

- Use Vite static build output.
- Use `/` as the default production base for the local server and switch to the repository base only for GitHub Pages builds.
- Inject Supabase browser credentials only for the hosted build path through local env vars and GitHub Actions secrets.
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
- The shipped repo should work immediately without requiring the owner to provision external services first.
- The repository name `para-practice` will be used for GitHub Pages base pathing.
- A focused but sufficiently varied seed bank is better than a huge low-quality bank.
- Adaptive behavior will be lightweight: weak domains get higher selection weight rather than a complex mastery engine.
- Lightweight sign-in is acceptable because saved progress should remain tied to a persistent learner identity.
