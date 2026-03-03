---
description: Standard procedure for committing code updates in GitExodus
---

# CRITICAL RULE: NEVER EVER PUSH CODE YOURSELF
> [!CAUTION]
> **ABSOLUTE PROHIBITION**: As the AI assistant, you are strictly FORBIDDEN from ever executing the `git push` command. Pushing code to the remote repository is strictly reserved for the human user to do themselves. There are NO exceptions to this rule. 
> For `git commit`, you must wait for a clear, direct, and unambiguous instruction like "Commit the code now" from the user. General approval is NEVER permission to commit.

When finalizing a phase of development, you MUST follow these steps:

1. **Update Documentation**:
    - Add a bullet point to `SESSION_HISTORY.md` under the current date describing the changes.
    - Mark completed items in `TASKS.md` or add new ones to the "Future Roadmap".
2. **Run Mandatory Tests**: You MUST verify the stability and quality of the project by running all test suites. Any commit MUST maintain or increase the project's test coverage to at least **80%**.
    - **Unit & UI Tests (Frontend)**: `npm run test`
    - **Coverage Check**: `npm run test:coverage` (Threshold: 80% Statements)
    - **Unit & Integration Tests (Backend)**: `cargo test`
    - **E2E Tests**: `npx playwright test`
    - If coverage is below 80% or any test fails, you MUST fix the issue and re-run all tests before proceeding.
3. **Segment Changes**: Review `git status` and logically group modified files by specific features or responsibilities.
3. **Stage Incremental Changes**: Stage files incrementally for each logical group.
4. **Conventional & Atomic Commits**: Commit each staged group separately using a clear, conventional commit message (e.g., `feat: ...`, `fix: ...`, `docs: ...`). Each commit should represent a single atomic change.
5. **Consistency**: Ensure the commit message adheres to previous project patterns, commitlint rules if applicable, and strict industrial standards.
6. **Pre-Release Verification**: BEFORE upgrading the version or creating a new release (e.g. creating tags), you MUST verify that the GitHub Actions release workflow works perfectly without any errors by running it **locally** (e.g., using `act`).
