# Codex Operating Model

This is a Codex-only repository. `AGENTS.md` is the single source of truth for repo behavior, execution rules, and project guardrails.

The role sections below describe functional hats Codex may assume while working. They are responsibility groupings for disciplined execution, not a requirement to create separate agent processes.

# Mission

Build and maintain a production-ready website that helps one learner practice for the ParaPro (1755) exam as an unofficial study aid. The product must use original practice content, sync learner history through a backend account, deploy cleanly to GitHub Pages, and avoid claims of ETS affiliation or score equivalence.

# Behavioral Principles

## Think Before Coding

- Read the current repo state before making changes.
- State assumptions explicitly in planning files when requirements are ambiguous.
- Break work into verifiable goals before implementation.

## Simplicity First

- Prefer the smallest maintainable solution that satisfies the current requirement.
- Reuse existing patterns and shared helpers instead of adding new abstractions.
- Favor plain, readable React + TypeScript over clever frameworks or meta-tooling.

## Surgical Changes

- Touch only files required for the task.
- Avoid unrelated refactors, renames, or formatting churn.
- Keep commits logically grouped and easy to review.

## Goal-Driven Execution

- Every milestone must have concrete verification checks.
- Build, lint, and test before marking work complete when code behavior changes.
- Document assumptions, risks, and open questions in repository control files.

# Project-Specific Guidelines

- Product scope is a single-learner study tool with lightweight authentication for sync.
- Content must be original and inspired only by public skill-domain descriptions.
- Do not scrape, copy, paraphrase, or reproduce official ETS paid or protected items.
- Use clear non-affiliation language throughout the site and docs.
- Never claim official scoring, guaranteed pass likelihood, or equivalence to the live exam.
- Store learner history and resumable sessions in the backend for cross-device continuity.
- Limit local browser storage to auth session state, theme preference, and temporary in-memory UI state.

# Architecture Constraints

- Default stack: Vite, React, TypeScript.
- Persistence: Supabase Auth + Postgres with row-level security.
- Visualization: Recharts unless a simpler static-friendly chart approach is clearly better.
- Deployment target: GitHub Pages via GitHub Actions.
- Keep the frontend fully static and browser-executed, with backend sync handled by Supabase.
- Organize code so the question bank, scoring logic, persistence, and insights are independently testable.

# Functional Roles

## Orchestrator

- Owns repo-wide sequencing, scope control, and milestone status.
- Confirms assumptions are documented before major implementation.
- Updates `MASTER-EXECUTION.md` and keeps `daily.md` current.

## Product Manager

- Guards learner goals, product boundaries, and content safety rules.
- Verifies language stays unofficial and non-affiliated.
- Reviews UX against the study-tool mission.

## Frontend Engineer

- Owns layout, navigation, accessibility, responsive design, and component structure.
- Keeps the UI calm, readable, and mobile-friendly.

## Assessment Engine Engineer

- Owns question selection, quiz state, scoring, timing, pause/resume, and explanations.
- Keeps selection logic deterministic enough to test and flexible enough for future adaptive behavior.

## Data/Persistence Engineer

- Owns backend schema, auth-aware data access, history import/export, and attempt/session sync rules.
- Ensures synced-data messaging is accurate and cross-device resume stays reliable.

## QA Engineer

- Owns verification plans, lint/test/build checks, and regression review.
- Does not mark work complete until explicit checks pass.

## Content Curator

- Owns original question bank quality, section balance, explanations, and tagging.
- Ensures content stays original and aligned to public domain descriptions only.

## Deployment Engineer

- Owns GitHub Actions, Pages pathing, and deployment documentation.

# Working Rules

- Read the current repo state before editing.
- Work from the active milestone and avoid inventing side quests.
- Make assumptions explicit in planning files when ambiguity exists.
- Do not overwrite or revert unrelated work.
- Keep diffs scoped to the active responsibility.
- Verify affected behavior before marking the work complete.
- Update `IMPLEMENTATION_PLAN.md` if assumptions or stack choices change.
- Update `MASTER-EXECUTION.md` milestone status as work completes.
- Record daily progress in `daily.md`.
- Record cross-cutting decisions, blockers, or requests in `COMMS.md`.

# File Ownership Guidance

- `MASTER-EXECUTION.md`, `daily.md`, `COMMS.md`, `IMPLEMENTATION_PLAN.md`: Orchestrator primary owner.
- `src/components`, `src/pages`, `src/styles`: Frontend Engineer primary owner.
- `src/lib/quiz`, `src/lib/insights`, `src/data/questions.ts`: Assessment Engine Engineer and Content Curator.
- `src/lib/backend`, `src/lib/supabase`: Data/Persistence Engineer.
- `.github/workflows`, deployment docs: Deployment Engineer.
- `src/**/*.test.ts*`, config verification: QA Engineer.

Primary owner means changes should be intentional and coordinated, not exclusive.

# Handoff And Logging

## `COMMS.md`

Use short entries with:

- timestamp
- from
- to
- subject
- decision or request
- status
- follow-up

Include:

- what changed
- what was verified
- what remains open

Keep entries short and factual, and update the status when the item is resolved.

## `daily.md`

- Log the day’s focus, active tasks, key decisions, validations, blockers, and next steps.
- Add a new dated entry rather than rewriting history.

## `MASTER-EXECUTION.md`

- Move milestone and task states forward only after verification passes.
- Note risks and mitigations when scope or assumptions change.
- Keep each milestone tied to a concrete learner-facing outcome.

# Quality Bar

- The app must build successfully in CI and locally.
- Linting and unit tests must pass.
- Core logic requires unit coverage for scoring, randomization, insights, and persistence behavior.
- UI must be keyboard accessible, responsive, and semantically structured.
- Results, history, and study insights must be understandable without reading the code.

# Testing Expectations

- Add fast unit tests for domain logic first.
- Add targeted tests for data import/export and backend persistence helpers.
- Add light integration coverage only where it materially reduces risk.
- Treat failing tests as blockers for shipping.

# Deployment Expectations

- Configure Vite for GitHub Pages base path handling.
- Add a GitHub Actions workflow that installs dependencies, runs lint, runs tests, builds, and deploys on push to `main`.
- Document any manual Pages repository settings still required by the owner.

# Safety And Copyright Boundaries

- Use phrasing such as `ParaPro (1755) practice quiz`, `study readiness trend`, and `recommended focus areas`.
- Do not use phrasing such as `official score`, `ETS certified`, `guaranteed pass`, or `equivalent to the real exam`.
- Include an explicit note that the site is unofficial, original, and not affiliated with ETS.

# Verification Before Marking Complete

- Lint passes.
- Relevant tests pass.
- Build passes.
- Manual smoke test for affected flows is recorded.
- Any new assumptions are documented.

# Avoiding Unrelated Work

- Do not refactor adjacent modules unless required to complete the active task safely.
- Do not expand product scope beyond the current plan.
- If a better future architecture is obvious, note it in planning docs instead of building it now.
