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

## 2026-04-18 - Public rollout

Current focus:

- Publish the site to GitHub Pages without manual post-setup work
- Keep the bundled backend reachable from the public site
- Verify the live URL, not just local builds

Tasks completed:

- Added cross-origin token auth and CORS support for the bundled backend
- Added a local tunnel daemon that updates the Pages backend secret and re-runs the workflow when the public URL changes
- Enabled GitHub Pages in workflow mode and published the site
- Fixed the workflow order so e2e coverage no longer overwrites the Pages-safe asset paths
- Removed the last inline theme-preference bootstrap so the site follows system settings only

Validation completed:

- Verified `npm run lint`
- Verified `npm run test`
- Verified `npm run build`
- Verified `npm run verify:local-backend`
- Verified `npm run test:e2e`
- Verified the GitHub Pages deployment workflow completed successfully
- Verified backend health through the active public tunnel

Next steps:

- Keep the local backend host machine online so the public bridge remains reachable
- Replace the tunnel bridge with hosted Supabase later if a permanent backend is desired

## 2026-04-18 - ParaPro alignment refresh

Current focus:

- Compare the current practice mix against official ETS/Washington guidance and recent test-taker reports
- Make the practice flow feel closer to the real ParaPro experience without copying protected items
- Tighten the on-screen chrome so more of the question stays visible

Tasks completed:

- Reviewed ETS ParaPro content guidance, Washington qualifying requirements, and recent community reports about topic emphasis
- Added more math items for common-denominator fractions, percentages, area/perimeter, geometry, and PEMDAS-style order of operations
- Updated the full-test selection logic so math appears more often and key math topic groups are intentionally represented
- Changed the last-question footer button from `Next` to `Submit attempt`
- Slimmed the top header so it takes less vertical space during practice

Validation completed:

- Verified `npm run lint`
- Verified `npm run test`
- Verified `npm run build`
- Verified `npm run test:e2e`
- Restarted the local launch-agent server and confirmed the last-question submit state on `http://127.0.0.1:3000`

Next steps:

- Keep expanding original math coverage, especially around no-calculator multi-step items, if more realism is needed after Dove tries the new mix

## 2026-04-19 - Public login recovery

Current focus:

- Restore account sign-in on the published GitHub Pages site
- Stop stale backend bridge URLs from showing up as a vague browser error
- Re-verify the full browser flow after the public auth fix

Tasks completed:

- Confirmed the deployed Pages bundle was still pointing at an expired tunnel URL while the active backend had moved to a new public address
- Replaced the rotating localhost.run bridge with the currently running Cloudflare quick tunnel for the published site
- Translated generic network fetch failures into a clearer saved-progress-service message for login and history loads
- Added focused unit coverage for the public-bridge selection and error-message normalization

Validation completed:

- Verified `npm run lint`
- Verified `npm run test`
- Verified `npm run test:e2e`
- Verified a Pages-targeted build
- Verified the current public tunnel returns the expected CORS headers for GitHub Pages requests

Next steps:

- Move the public backend to hosted Supabase later so the published site no longer depends on the local machine staying online
