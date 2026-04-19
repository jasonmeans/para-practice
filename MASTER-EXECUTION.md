# Product Vision

Create a calm, polished ParaPro (1755) study website that helps one learner practice with original questions, save progress through a backend account, and choose next study steps with confidence.

# Goals

- Deliver a complete practice experience with backend-backed sign-in, saved progress, and resumable study sessions for one learner.
- Provide original mixed tests, section quizzes, and adaptive weak-area study modes.
- Persist attempts in the backend and surface trends and actionable study insights.
- Ship automated GitHub Pages deployment with clean CI checks.
- Maintain repo discipline through explicit plans, ownership, and verification.

# Milestones

## Milestone 1: Operating Foundation

Status: `completed`

Tasks:

- Create unified `AGENTS.md` operating guidance
- Create `IMPLEMENTATION_PLAN.md`
- Create `daily.md`
- Create `COMMS.md`
- Create `MASTER-EXECUTION.md`

Verification:

- Required control files exist in repo root.
- Assumptions and product boundaries are documented.

## Milestone 2: Static App Foundation

Status: `completed`

Tasks:

- Scaffold the chosen stack
- Establish app shell, routing, styling, and layout
- Configure linting, formatting, testing, and build settings

Verification:

- Local dev build succeeds
- Lint runs cleanly
- Test runner executes

## Milestone 3: Assessment Engine

Status: `completed`

Tasks:

- Define question data model
- Add original seed question bank
- Implement randomized quiz generation
- Implement scoring and answer review
- Support backend-saved pause/resume

Verification:

- Learner can start and complete a randomized attempt
- Results show total and section performance
- Unit tests cover scoring and randomization logic

## Milestone 4: Persistence, History, and Insights

Status: `completed`

Tasks:

- Add backend persistence and sign-in flow
- Save attempts and resumable sessions server-side
- Build history drilldown and JSON import/export
- Build trends and study insights

Verification:

- Attempts persist after sign-in through the active backend
- Trend charts render from stored data
- Weak-area recommendations update from history
- Unit tests cover persistence and insights logic

## Milestone 5: Deployment and Documentation

Status: `completed`

Tasks:

- Add GitHub Pages workflow
- Configure base path handling
- Update README with setup, usage, storage, and deployment details

Verification:

- CI workflow runs lint, tests, and build
- Deploy workflow targets GitHub Pages on push to `main`
- README explains required Pages settings

# Dependencies

- Milestone 1 before all coding.
- Milestone 2 before Milestones 3 and 4.
- Milestone 3 data model before persistence and insights are finalized.
- Milestone 5 after build/test workflows are stable.

# Status Tracking

- Active milestone: None
- Next milestone: Optional hosted Supabase rollout only

# Release Validation

- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run verify:local-backend`
- `npm run test:e2e`
- Live GitHub Pages smoke test against the published URL

# Risks and Mitigations

## Risk: Scope creep from nice-to-have features

Mitigation: Treat optional features as additive only if they do not complicate the core architecture.

## Risk: Weak content variety for retakes

Mitigation: Seed a sufficiently broad original question bank with balanced tags and topic coverage.

## Risk: GitHub Pages pathing mistakes

Mitigation: Configure Vite base path intentionally and verify workflow output paths.

## Risk: Backend setup friction

Mitigation: Keep the backend surface small, ship a ready-to-run local backend for immediate use, retain documented Supabase setup for hosted deployments, and automate the Pages backend bridge so repo secret updates do not require manual redeploy steps.
