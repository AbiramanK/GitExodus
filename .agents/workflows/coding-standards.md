---
description: General coding standards and grammar rules for the project
---

## General Rules
- **Quality**: Prioritize visual excellence and premium design in all web UI changes.
- **Language**: Always check the user's grammar, vocabulary, and spelling in their queries.
- **Tone**: Maintain a helpful, proactive, and friendly collaborative tone.
- **Commits**: Never execute `git commit` without explicit, direct user permission (e.g. "Yes, commit this"). "LGTM" is not enough.
- **Workflow Maintenance**: If the user modifies a rule or an established procedure during the conversation, you MUST immediately update the relevant workflow file in `.agents/workflows` to ensure persistent momentum.
- **Testing**: Target at least 80% test coverage for all features. This includes unit tests for core logic, integration tests for API/commands, and E2E tests for main user flows.

## Tech Stack (Frontend)
- **Core**: HTML, TSX (React), Tailwind CSS v4.
- **State**: Redux Toolkit (RTK Query).
- **Icons**: Lucide React.
- **Components**: Shadcn UI (located in `src/components/ui`).

## Tech Stack (Backend)
- **Framework**: Tauri v2.
- **Language**: Rust.
- **Asynchrony**: Use `tokio` for background tasks to avoid UI lag.
- **Patterns**: Use Tauri events (`emit`, `listen`) for real-time updates.
