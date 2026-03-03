# Release Notes - GitExodus

## [v0.3.0] - 2026-03-03
### Added
- **Hunk-Level Discard**: Revert specific code segments (hunks) within a file without affecting other changes.
- **Segmented Diff Viewer**: A new, premium diff viewer that renders individual hunks as collapsible cards for better focus.
- **Inline Discard Buttons**: Action buttons placed directly next to the code segments they affect.
- **Documentation Section**: Comprehensive, interactive documentation on the landing page with separate guides for Users and Developers.
- **Developer Onboarding**: Detailed PR guidelines, branch naming conventions, and project setup instructions.
- **Standardized Iconography**: Unified `Undo` icon for all revert operations across the app.

### Changed
- **Improved Navigation**: Replaced the "X" close button in the diff viewer with a "Back" button on the left for a more intuitive flow.
- **Landing Page Navbar**: Added a direct link to the Documentation section.
- **Sidebar Footer**: Finalized the stacked layout for Theme Switch and Exit buttons.

---

## [v0.2.0] - 2026-02-21
### Added
- **Analytics Dashboard**: Real-time stats, health charts, and system monitoring.
- **Multi-root Scanning**: Support for adding multiple base paths for repository discovery.
- **GitExodus Branding**: High-fidelity neon bird logo and sharp high-DPI favicons.
- **Exit Confirmation**: Native dialogs to prevent accidental application closure.
- **Screenshot Carousel**: Interactive Framer Motion showcase on the landing page.
- **Deployment Automation**: Automated GitHub Pages deployment for the landing site.

### Changed
- **Sidebar Overhaul**: Professional industrial-grade sidebar with unified iconography and simplified profile view.
- **Routing System**: Robust state-driven multi-page navigation.

---

## [v0.1.0] - 2026-02-20
### Added
- **Core Scanner**: Concurrent Rust-based engine for blazingly fast `.git` discovery.
- **Git Operations**: Backend integration for commit, push, and safe delete.
- **App Discovery**: Automatic detection of installed IDEs (VS Code, Cursor, IntelliJ, etc.).
- **'Open With' Menu**: Split-button utility for launching repositories in favorite editors.
- **Bulk Actions**: Multi-select repositories for batch commits and pushes.
- **Universal Sync**: One-click "Sync All" for backing up all local branches.
- **GitHub-style Diff**: High-fidelity sequential file card diff viewer.
- **Landing Page**: Initial VS Code-inspired landing site with OS detection.
- **Testing Infrastructure**: Full testing stack with Vitest, MSW, and Playwright.

### Safety
- **Safe Delete Safeguard**: Prevents deletion of repositories with unsynced or uncommitted work.
