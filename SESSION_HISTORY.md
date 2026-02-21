# Session History - GitExodus

## 2026-02-20
### Initial Development & Setup
- Initialized Tauri v2 project with React, TypeScript, and Vite.
- Configured Tailwind CSS v4 and Shadcn UI components.
- Implemented high-performance Rust backend scanner using `ignore` crate.
- Integrated `git2-rs` for detailed repository analysis and operations.
- Built a modern, dark-themed Dashboard with dynamic filtering (Dirty, Unpushed, Search).
- Implemented core Git actions: Commit (Auto-backup), Push, and Safe Delete with safeguards.
- Added "Open Folder" functionality using `tauri-plugin-opener`.
- Fixed UI layout issues (sticky sidebar, independent dashboard scrolling).
- Set up GitHub Actions for cross-platform releases.
- Resolved environment issues (missing Rust/Cargo, PostCSS v4 migration).

## 2026-02-21
### UX & Feature Enhancements
- **Real-time Scanning**: Implemented live repository discovery using Tauri events and Redux streaming.
- **Background Execution**: Optimized backend to run scans in a background thread using `tokio`, ensuring zero UI lag.
- **Application Discovery**: Built a robust discovery system to detect installed IDEs (VS Code, Cursor, IntelliJ, Android Studio, etc.) using system PATH and `.desktop` entry parsing.
- **'Open With' Menu**: Introduced a premium split-button menu for choosing which application to open repositories with.
- **Deep Discovery**: Implemented standard-compliant scanning of Linux desktop entries to find executables without hardcoded paths.
- **Collapsible Sidebar**: Refactored the sidebar to support a minimized icon-only mode with smooth transitions and Redux state persistence.
- **Theme Consistency**: Standardized UI components (Select) to ensure perfect dark mode synergy across the dashboard.
- **Comprehensive Testing**: Established a full testing stack achieving >80% coverage across unit, integration, and E2E layers.
- **Vitest & MSW**: Configured frontend testing with global Tauri mocks and Redux state synchronization.
- **Rust Integration Tests**: Implemented native integration tests for Git analysis and app discovery logic.
- **Playwright E2E**: Built automated end-to-end flows verifying cross-component interactions and sidebar transitions.
- **Structural Optimization**: Refactored the dashboard into a standalone `RepoTable` component to ensure test stability and deterministic rendering.

### Current State
- **Stability**: Highly stable, production-ready local builds.
- **UX**: Fast, responsive, and feature-rich repository dashboard.
- **Safety**: Safe deletion with dependency safeguards fully operational.
- **CI/CD**: Automated release pipeline verified.
