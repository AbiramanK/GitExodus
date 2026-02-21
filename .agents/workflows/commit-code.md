---
description: Standard procedure for committing code updates in GitExodus
---

# CRITICAL RULE: NO AUTOMATIC COMMITS
> [!CAUTION]
> **Strict User Permission Required**: You are FORBIDDEN from executing the `git commit` command unless the user has explicitly given a direct instruction to commit in their most recent message. "LGTM" or general approval of a plan is NOT sufficient; you must ask and receive a specific "Yes, commit" or similar affirmative to the act of committing itself.

When finalizing a phase of development, you MUST follow these steps:

1. **Update Documentation**:
    - Add a bullet point to `SESSION_HISTORY.md` under the current date describing the changes.
    - Mark completed items in `TASKS.md` or add new ones to the "Future Roadmap".
2. **Segment Changes**: Review `git status` and logically group modified files by specific features or responsibilities (e.g., frontend components, backend logic, documentation, configuration). Do NOT blindly `git add .` if changes touch disparate systems.
3. **Stage Incremental Changes**: Stage files incrementally for each logical group.
4. **Conventional & Atomic Commits**: Commit each staged group separately using a clear, conventional commit message (e.g., `feat: ...`, `fix: ...`, `docs: ...`). Each commit should represent a single atomic change.
5. **Consistency**: Ensure the commit message adheres to previous project patterns, commitlint rules if applicable, and strict industrial standards.
