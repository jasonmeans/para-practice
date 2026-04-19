# Daily Log

## 2026-04-18 - Project Kickoff

Current focus:

- Establish operating files and implementation plan
- Choose the simplest maintainable stack
- Build the first production-ready version end to end

Tasks in progress:

- Inspect existing repository state
- Define architecture and milestone checks
- Scaffold static app foundation

Blockers:

- None at kickoff

Decisions made:

- Keep the frontend static and GitHub Pages-friendly
- Favor Vite + React + TypeScript for maintainability and testability
- Shift persistence to Supabase auth plus Postgres so history and active sessions can move across devices and browsers
- Keep theme preference synced to system settings by default

Validation completed:

- Confirmed repo is nearly empty and safe for focused implementation
- Added control files and repo guidance documents
- Built static app, backend sync hooks, mobile-friendly practice flow, history, trends, and study insights
- Verified `npm run lint`, `npm run test`, and `npm run build`

Next steps:

- Push verified implementation to `main`
- Add Supabase project credentials to `.env.local` for local dev and GitHub Actions secrets for deployment
- Enable GitHub Pages source as GitHub Actions in repo settings if not already enabled

## 2026-04-18 - Local backend completion

Current focus:

- Finish the app so it works immediately without external provisioning
- Verify account creation, saved sessions, and attempt persistence through the backend
- Align project docs and milestone tracking with the shipped runtime

Tasks completed:

- Added a bundled local backend with account auth, history storage, and static asset serving
- Routed frontend auth and history persistence through either the local backend or Supabase
- Updated build configuration so local production builds use `/` and Pages builds keep the repo base path
- Tightened learner-facing copy so storage claims stay accurate in both runtime modes

Blockers:

- Hosted Supabase deployment remains optional because no project credentials were available in the repo or GitHub secrets

Decisions made:

- Ship the local backend as the default ready-to-run path
- Keep Supabase support as the hosted deployment option instead of removing it
- Store local backend data in `~/.para-practice-local/store.json`

Validation completed:

- Verified `npm run lint`
- Verified `npm run test`
- Verified `npm run build`
- Verified `npm run verify:local-backend`

Next steps:

- Keep the local service running for Dove's use
- Optionally add hosted Supabase credentials later if internet-facing deployment becomes necessary

## 2026-04-18 - Theme and e2e hardening

Current focus:

- Remove manual theme controls so the app follows system light/dark settings only
- Reproduce and validate the full practice flow in a real browser
- Add durable e2e coverage around saved-session and history workflows

Tasks completed:

- Removed the theme toggle and local theme preference storage
- Added isolated Playwright coverage for sign-up, full-test start, pause/resume, export, clear, and import
- Updated the Pages workflow to run browser e2e coverage before deploy

Validation completed:

- Verified `npm run lint`
- Verified `npm run test`
- Verified `npm run build`
- Verified `npm run test:e2e`

Next steps:

- Reload the live local service with the updated build
