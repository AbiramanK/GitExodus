---
description: Rules and procedures for testing and coverage in GitExodus
---

## Coverage Target
- **80% Minimum**: Every new feature or fix MUST be accompanied by tests that maintain or improve the overall project coverage to at least 80%.

## Testing Levels
1. **Integration Tests (Rust)**:
    - MUST be located in the `src-tauri/tests/` directory, separate from source code.
    - Focus on logic in `git_logic.rs`, `app_discovery.rs`, and `scanner.rs`.
2. **Unit & Integration Tests (React)**:
    - MUST be located in a dedicated `src/__tests__/` directory.
    - Focus on Redux slices, hooks, and complex components.
3. **E2E Tests (Tauri/Playwright)**:
    - Located in the `e2e/` directory.
    - Focus on critical user journeys: Scanning -> Detection -> Action (Commit/Open).

## Pre-commit Validation
Before committing any code, you MUST run the following validations:
1. **Frontend**: `npm run test` (Unit/UI)
2. **Backend**: `cargo test` (Logic/Integration)
3. **End-to-End**: `npx playwright test` (Critical flows)

## Commands Reference
- **Frontend Unit & UI**: `npm run test`
- **Frontend Coverage**: `npm run test:coverage`
- **Tailwind/Vite Dev**: `npm run dev`
- **Backend Tests**: `cargo test`
- **E2E (Playwright)**: `npx playwright test`
- **E2E (UI Mode)**: `npx playwright test --ui`
