# Mission

Build and maintain a production-ready website that helps one learner practice for the ParaPro (1755) exam as an unofficial study aid. The product must use original practice content, sync learner history through a backend account, deploy cleanly to GitHub Pages, and avoid claims of ETS affiliation or score equivalence.

# Behavioral Principles

## Think Before Coding

- Read the existing repo state before making changes.
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
- Build, lint, and test before marking work complete.
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

# Safety and Copyright Boundaries

- Use phrasing such as `ParaPro (1755) practice quiz`, `study readiness trend`, and `recommended focus areas`.
- Do not use phrasing such as `official score`, `ETS certified`, `guaranteed pass`, or `equivalent to the real exam`.
- Include an explicit note that the site is unofficial, original, and not affiliated with ETS.

# Working Rules

- Update `IMPLEMENTATION_PLAN.md` if assumptions or stack choices change.
- Update `MASTER-EXECUTION.md` milestone status as work completes.
- Record daily progress in `daily.md`.
- Record cross-role requests or decisions in `COMMS.md`.
