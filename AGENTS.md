# Agent Model

This repository is designed to support Codex and future collaborating agents working in a shared GitHub codebase without stepping on each other.

# Roles

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

# Collaboration Rules

- Read the current repo state before editing.
- Work from the active milestone and avoid inventing side quests.
- Make assumptions explicit in planning files when ambiguity exists.
- Do not overwrite or revert unrelated work.
- Keep diffs scoped to the role’s current responsibility.
- Verify affected behavior before handoff.

# File Ownership Guidance

- `MASTER-EXECUTION.md`, `daily.md`, `COMMS.md`, `IMPLEMENTATION_PLAN.md`: Orchestrator primary owner.
- `src/components`, `src/pages`, `src/styles`: Frontend Engineer primary owner.
- `src/lib/quiz`, `src/lib/insights`, `src/data/questions.ts`: Assessment Engine Engineer and Content Curator.
- `src/lib/backend`, `src/lib/supabase`: Data/Persistence Engineer.
- `.github/workflows`, deployment docs: Deployment Engineer.
- `src/**/*.test.ts*`, config verification: QA Engineer.

Primary owner means changes should be intentional and coordinated, not exclusive.

# Handoff Format

Use short entries in `COMMS.md` with:

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

# How To Use `COMMS.md`

- Record cross-role decisions, open requests, and blockers.
- Keep entries short and factual.
- Update the status when the receiving role resolves the item.

# How To Use `daily.md`

- Log the day’s focus, active tasks, key decisions, validations, blockers, and next steps.
- Add a new dated entry rather than rewriting history.

# How To Update `MASTER-EXECUTION.md`

- Move milestone and task states forward only after verification passes.
- Note risks and mitigations when scope or assumptions change.
- Keep each milestone tied to a concrete learner-facing outcome.

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
