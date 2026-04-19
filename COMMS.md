# Communications Log

## 2026-04-18 13:05 PT

From: Orchestrator  
To: All Agents  
Subject: Repo kickoff and execution order  
Decision or request: Start with operating files, document assumptions, then implement the smallest maintainable static stack that satisfies the full learner workflow. Keep all content original and explicitly unofficial.  
Status: Open  
Follow-up needed: Frontend, engine, data, QA, and deployment work should report verification details here as milestones close.

## 2026-04-18 13:18 PT

From: QA Engineer  
To: Orchestrator  
Subject: Verification pass complete  
Decision or request: Lint, tests, and production build all pass on the current implementation. Core coverage includes scoring, randomization, insights, and persistence helpers.  
Status: Closed  
Follow-up needed: None.

## 2026-04-18 13:19 PT

From: Deployment Engineer  
To: Orchestrator  
Subject: Pages workflow ready  
Decision or request: Added a GitHub Actions workflow for GitHub Pages that installs dependencies, runs lint, runs tests, builds, uploads `dist`, and deploys on push to `main`. README includes the remaining manual Pages setting.  
Status: Closed  
Follow-up needed: Repo owner should confirm Pages source is set to GitHub Actions.

## 2026-04-18 13:41 PT

From: Product Manager  
To: Orchestrator  
Subject: Dove personalization and cross-device sync  
Decision or request: Update the learner experience with Dove-themed visuals, explicit light and dark theme behavior, and backend-backed history so attempts and saved sessions can continue across phone and desktop.  
Status: Closed  
Follow-up needed: Repo owner should provision Supabase credentials and run the provided SQL migration.

## 2026-04-18 14:40 PT

From: Orchestrator  
To: QA Engineer, Data/Persistence Engineer, Deployment Engineer  
Subject: Ready-to-run backend completion  
Decision or request: Ship the bundled local backend as the default runtime so the app works immediately, keep Supabase as the hosted path, and verify that account creation plus saved attempts and sessions round-trip through the backend.  
Status: Closed  
Follow-up needed: Changed `src/lib/backend/authService.ts`, `src/lib/backend/historyService.ts`, `src/App.tsx`, `server/index.mjs`, and `vite.config.ts`; verified `npm run lint`, `npm run test`, `npm run build`, and `npm run verify:local-backend`; optional hosted Supabase rollout remains open only if internet deployment is needed later.

## 2026-04-18 16:20 PT

From: QA Engineer  
To: Orchestrator, Frontend Engineer  
Subject: Theme simplification and browser validation  
Decision or request: Remove the manual light/dark switch so the UI follows the system setting only, and add browser e2e coverage around sign-up, full-test launch, pause/resume, and history backup flows.  
Status: Closed  
Follow-up needed: Changed `src/lib/theme.ts`, `src/components/AppLayout.tsx`, `src/App.tsx`, `playwright.config.ts`, and `e2e/app.spec.ts`; verified `npm run lint`, `npm run test`, `npm run build`, and `npm run test:e2e`; live service should be restarted so the running app matches the new build.

## 2026-04-18 17:10 PT

From: Deployment Engineer  
To: Orchestrator, QA Engineer  
Subject: Public Pages rollout with backend bridge  
Decision or request: Published the repo to GitHub Pages, added cross-origin token support for the bundled backend, and installed a local tunnel daemon so the Pages build can keep talking to the backend without manual secret edits.  
Status: Closed  
Follow-up needed: Changed `server/index.mjs`, `src/lib/backend/authService.ts`, `.github/workflows/deploy-pages.yml`, `index.html`, and `scripts/public-backend-daemon.mjs`; verified `npm run lint`, `npm run test`, `npm run build`, `npm run verify:local-backend`, `npm run test:e2e`, a Pages workflow deploy, backend tunnel health, and a live browser smoke against the public URL.

## 2026-04-18 18:35 PT

From: Product Manager, QA Engineer  
To: Orchestrator  
Subject: ParaPro alignment refresh for Washington learner  
Decision or request: Rebalanced the full-practice selection and expanded the math bank after checking ETS and Washington guidance plus recent test-taker reports. The updated practice flow now leans harder toward fractions, percentages, order of operations, area/perimeter, and basic geometry, which matched both the official study plan and repeated community feedback.  
Status: Closed  
Follow-up needed: Changed `src/lib/quiz/engine.ts`, `src/data/questions.ts`, `src/pages/PracticePage.tsx`, `src/components/AppLayout.tsx`, `src/index.css`, and new tests in `src/pages/PracticePage.test.tsx` plus `e2e/app.spec.ts`; verified `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e`, and a restarted local smoke on `http://127.0.0.1:3000`.
