---
description: Standard procedure for committing code updates in GitExodus
---

When finalizing a phase of development, you MUST follow these steps:

1. **Update Documentation**:
    - Add a bullet point to `SESSION_HISTORY.md` under the current date describing the changes.
    - Mark completed items in `TASKS.md` or add new ones to the "Future Roadmap".
2. **Stage Changes**: Ensure all relevant modified files are staged.
3. **Conventional Commit**: Use a clear, conventional commit message (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
4. **Consistency**: Ensure the commit message adheres to previous project patterns and commitlint rules if applicable.
