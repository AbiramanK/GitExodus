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
### Testing & Quality Assurance
- **Unauthorized Push Fix**: Corrected agent behavior to strictly prohibit `git push` operations without explicit user consent. Updated `.agents/workflows/commit-code.md` to establish this boundary.
- **80% Coverage Target**: Successfully attained 80.25% project-wide statement coverage, fulfilling the pre-commit mandatory requirement.
- **Suite Stabilization**: Stabilized all 20 test suites, resolving persistent hangs in `DiffViewerDialog` and rendering issues in `Dashboard`.
- **API coverage**: Achieved nearly 100% test coverage for the `gitApi` layer, ensuring all CRUD operations and error paths are verified.
- **Structural Tests**: Added unit tests for the main `App` routing and sidebar interactions.
- **Agent Governance**: Updated `.agents/workflows/commit-code.md` to strictly enforce the 80% coverage rule for all future development.

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

## 2026-02-23
### Open Source Compliance & Documentation
- **License**: Added the MIT License file.
- **Contributing Guide**: Created `CONTRIBUTING.md` with guidelines for bug reports, enhancements, and PRs.
- **Code of Conduct**: Adopted the Contributor Covenant v2.1 in `CODE_OF_CONDUCT.md`.
- **Security Policy**: Established a vulnerability reporting process in `SECURITY.md`.
- **Support**: Added `SUPPORT.md` with links to discussions and issues.
- **Installation Guide**: Built a comprehensive `INSTALL.md` covering both commercial users (pre-built binaries) and developers (source build).
- **GitHub Templates**: Implemented standard templates for Bug Reports, Feature Requests, and Pull Requests in the `.github` directory.
- **Documentation Sync**: Updated `README.md` with the official GitHub Pages URL and high-visibility links to all new documentation.
- **Branding Sync**: Regenerated all application icons from the high-fidelity bird logo source and implemented a fail-safe programmatic window icon set in `lib.rs` (with necessary `Cargo.toml` feature updates) to ensure visual consistency in development mode on Linux.
- **Dashboard Optimization**: Fixed dashboard scanning logic by implementing autoscan on component mount and adding a home-directory fallback for when no scan roots are explicitly defined.
- **Architectural Refactor**: Synchronized scanning logic across the Dashboard and Repository pages by implementing a custom `useScan` hook, ensuring deterministic behavior and high maintainability.

### Current State (v0.2.1-compliance)
- **Compliance**: Fully compliant with open-source industry standards.
- **Onboarding**: Streamlined installation and contribution flows for all user types.
- **Infrastructure**: Robust issue and PR management via GitHub templates.
- **Visibility**: Documentation centralized and linked directly from the primary README.
- **Multi-root Scanning**: Replaced the single-root home directory scan with a flexible multi-root system. Users can now add multiple base paths for repository discovery.
- **Settings Dashboard**: Implemented a dedicated Settings page with folder selection dialogs and persistent configuration management.
- **Dynamic Routing**: Built a state-driven page switching mechanism to support multi-view application architecture.
- **Dialog System Integration**: Integrated and initialized `tauri-plugin-dialog` for native filesystem interactions.
- **UI/UX Refinement**: Enhanced the landing page with a premium Framer Motion screenshot carousel. Further refined the application architecture by moving the Theme Switch to the sidebar for global access, adding a "Scan Ecosystem" button to the Analytics Dashboard, and simplifying the sidebar by removing unnecessary user profile details. Restructured the sidebar footer to feature distinct, vertically stacked "Theme Switch" and "Exit" buttons for improved accessibility.
## 2026-03-03
### Granular Control & Documentation
- **Hunk-Level Discard**: Implemented the ability to discard specific code segments (hunks) within a file without reverting the entire file.
- **Backend (Rust)**: Updated `git_logic.rs` to extract individual hunk patches and implemented `discard_hunk` using `git apply -R`.
- **Frontend (React/Redux)**: Added `discardHunk` mutation and updated UI models to support hunk-level data.
- **Segmented Diff Viewer**: Redesigned the diff viewer in `DiffViewerDialog` to render individual hunks as collapsible cards with inline "Discard" buttons, significantly improving the user experience for granular changes.
- **Improved UI Navigation**: Replaced the "X" close button in the diff viewer header with a "Back" button on the left for better navigation flow.
- **Standardized Iconography**: Standardized the use of the `Undo` icon for all discard/revert actions across the application.
- **Enhanced Documentation**: Built a comprehensive, interactive Documentation section on the landing page with separate tabs for Users (Installation) and Developers (Setup & PR Guidelines).
- **Landing Page Polish**: Updated the landing page navbar and layout to improve accessibility and onboarding for new users and contributors.

### Current State (v0.3.0 Release)
- **Granular Control**: Industry-standard hunk-level revert functionality now fully operational.
- **UX**: Professional, segmented diff viewer with inline actions and intuitive navigation.
- **Documentation**: Comprehensive guides for both users and developers integrated directly into the landing page.
- **Stability**: Backend logic remains highly performant, utilizing direct Git patches for safe operations.
- **Branding**: Continued refinement of the high-fidelity bird identity across all touchpoints.
