---
description: Standard procedure for committing code updates in GitExodus
---

# CRITICAL RULE: NEVER COMMIT WITHOUT EXPLICIT WRITTEN PERMISSION
> [!CAUTION]
> **ABSOLUTE PROHIBITION**: You are strictly FORBIDDEN from executing the `git commit` command. There are NO exceptions to this rule. You must wait for a clear, direct, and unambiguous instruction like "Commit the code now" or "Proceed with the commit" in the user's most recent message. General approval or planning approval is NEVER permission to commit.

When finalizing a phase of development, you MUST follow these steps:

1. **Update Documentation**:
    - Add a bullet point to `SESSION_HISTORY.md` under the current date describing the changes.
    - Mark completed items in `TASKS.md` or add new ones to the "Future Roadmap".
2. **Run Mandatory Tests**: You MUST verify the stability of the project by running all test suites. If any test fails, you MUST fix the issue and re-run all tests before proceeding.
    - **Unit & UI Tests (Frontend)**: `npm run test`
    - **Unit & Integration Tests (Backend)**: `cargo test`
    - **E2E Tests**: `npx playwright test`
3. **Segment Changes**: Review `git status` and logically group modified files by specific features or responsibilities.
3. **Stage Incremental Changes**: Stage files incrementally for each logical group.
4. **Conventional & Atomic Commits**: Commit each staged group separately using a clear, conventional commit message (e.g., `feat: ...`, `fix: ...`, `docs: ...`). Each commit should represent a single atomic change.
5. **Consistency**: Ensure the commit message adheres to previous project patterns, commitlint rules if applicable, and strict industrial standards.
