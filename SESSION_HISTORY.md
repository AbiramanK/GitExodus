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

## 2026-02-22
### CI/CD & Testing Stability
- Resolved TypeScript errors in frontend unit tests (`AppSidebar.test.tsx`, `repoSlice.test.ts`, `uiSlice.test.ts`) to fix GitHub Release Action.
- Cleaned up unused `useState` import in `Settings.tsx`.
- Synchronized dependency lockfiles for root and landing page.

## 2026-02-21
### UX & Feature Enhancements
- **Real-time Scanning**: Implemented live repository discovery using Tauri events and Redux streaming.
- **Background Execution**: Optimized backend to run scans in a background thread using `tokio`, ensuring zero UI lag.
- **Application Discovery**: Built a robust discovery system to detect installed IDEs (VS Code, Cursor, IntelliJ, Android Studio, etc.) using system PATH and `.desktop` entry parsing.
- **'Open With' Menu**: Introduced a premium split-button menu for choosing which application to open repositories with.
- **Deep Discovery**: Implemented standard-compliant scanning of Linux desktop entries to find executables without hardcoded paths.
- **Collapsible Sidebar**: Refactored the sidebar to support a minimized icon-only mode with smooth transitions and Redux state persistence.
- **Theme Consistency**: Standardized UI components (Select) to ensure perfect dark mode synergy across the dashboard.
- **Premium UI Controls**: Replaced native browser prompts with custom Shadcn-inspired `CommitDialog` and `Popconfirm` components.
- **Comprehensive Testing**: Established a full testing stack achieving **82.06%** statement coverage across unit, integration, and E2E layers.
- **Vitest & MSW**: Configured frontend testing with global Tauri mocks and Redux state synchronization.
- **Rust Integration Tests**: Implemented native integration tests for Git analysis and app discovery logic.
- **Expanded E2E Flows**: Finalized Playwright flows verifying Sidebar toggling, responsive layout changes, Search logic, and UI Filters with a **100% pass rate**.
- **Agent Governance**: Codified developmental constraints into agent workflows, including the "Commit only when asked" rule.
- **Structural Optimization**: Refactored the dashboard into a standalone `RepoTable` component to ensure test stability and deterministic rendering.
- **Global Theme Management**: Integrated Light/Dark context switching, adjusting Tailwind CSS configuration for dynamic `.light` mode overrides and ensuring all custom Shadcn-like components (Select) sync flawlessly.
- **GitHub-style Diff Viewer**: Overhauled the code comparison viewer to emulate GitHub's Commit Page design, rendering sequential file cards over a full-screen dynamic window, rather than a crowded sidebar approach.
- **Landing Page**: Built an SEO-friendly, animated VS Code-inspired Landing Page (`/landing`) with automatic Framer Motion transitions and OS-detecting downloads.
- **GitHub Pages Automation**: Configured a `deploy-landing.yml` CI/CD pipeline to compile and distribute the landing page automatically across the `gh-pages` branch.
- **Bulk Actions & Universal Sync**: Implemented a multi-select system with a floating action bar. Built a universal "Sync All Repos" button that commits and pushes all dirty/unpushed branches across the system using `push --all`.
- **CI/CD Fixes**: Resolved landing page 404 errors by implementing relative pathing and `.nojekyll` configuration. Updated the `release.yml` workflow to trigger automatic draft releases on every push to the `master` branch.
- **Landing Page Feature Sync**: Synchronized landing page content with current app capabilities (Bulk Actions, Universal Sync) and added a dedicated Release Notes section for v0.1.0.
- **Visual Showcase**: Replaced landing page placeholders with interactive app screenshots of the Dashboard and Diff Viewer, implementing a tabbed transition for a premium feel.
- **Analytics Dashboard**: Built a completely new primary view with animated charts, statistics cards, and system health monitoring.
- **Repositories Refactor**: Moved repository discovery and management logic to a dedicated page for better scalability.
- **Industrial Sidebar**: Redesigned the sidebar to include user profiles, unified iconography, and a more professional layout matching high-tier IDEs. Now integrated with a custom high-fidelity logo.
- **Branding Update**: Designed and integrated a new high-fidelity geometric bird logo with neon enhancements. Refined the asset using ImageMagick for true transparency and implemented a premium circular-disk bird favicon to ensure maximum visibility and brand consistency across all browser themes.
- **Routing Overhaul**: Implemented a robust multi-page routing system using Redux to manage application state transitions.
- **Strict Governance**: Refined agent workflows to strictly mandate user permission for all code commits, ensuring total control over the repository state.
- **Multi-root Scanning**: Replaced the single-root home directory scan with a flexible multi-root system. Users can now add multiple base paths for repository discovery.
- **Settings Dashboard**: Implemented a dedicated Settings page with folder selection dialogs and persistent configuration management.
- **Dynamic Routing**: Built a state-driven page switching mechanism to support multi-view application architecture.
- **Dialog System Integration**: Integrated and initialized `tauri-plugin-dialog` for native filesystem interactions.
- **UI/UX Refinement**: Enhanced the landing page with a premium Framer Motion screenshot carousel. Further refined the application architecture by moving the Theme Switch to the sidebar for global access, adding a "Scan Ecosystem" button to the Analytics Dashboard, and simplifying the sidebar by removing unnecessary user profile details. Restructured the sidebar footer to feature distinct, vertically stacked "Theme Switch" and "Exit" buttons for improved accessibility.
### Current State (v0.2.0 Release)
- **Stability**: Highly stable, production-ready local builds.
- **UX**: Fast, responsive Analytics Dashboard with multi-root scanning.
- **Safety**: Safe deletion and Exit Confirmation logic fully operational.
- **Branding**: Native high-fidelity logo and favicon integration complete.
- **CI/CD**: Automated release and landing page deployment verified.
