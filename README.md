# GitExodus

[![Build Status](https://github.com/AbiramanK/GitExodus/actions/workflows/release.yml/badge.svg)](https://github.com/AbiramanK/GitExodus/actions/workflows/release.yml)
[![Landing Page](https://github.com/AbiramanK/GitExodus/actions/workflows/deploy-landing.yml/badge.svg)](https://github.com/AbiramanK/GitExodus/actions/workflows/deploy-landing.yml)
[![Tests](https://img.shields.io/badge/tests-90%20passed-brightgreen)](https://github.com/AbiramanK/GitExodus)
[![Coverage](https://img.shields.io/badge/coverage-80.25%25-brightgreen)](https://github.com/AbiramanK/GitExodus)
[![GitHub Stars](https://img.shields.io/github/stars/AbiramanK/GitExodus?style=social)](https://github.com/AbiramanK/GitExodus)
[![GitHub Issues](https://img.shields.io/github/issues/AbiramanK/GitExodus)](https://github.com/AbiramanK/GitExodus/issues)

GitExodus is a high-performance system utility for automating Git repository management and cleanup across your entire local machine. Built with **Tauri v2**, **Rust**, and **React**, it offers a blazingly fast experience with native OS integration.

## Key Features

- 🚀 **High-Speed Scanner**: Recursively finds `.git` directories using concurrent file system scanning.
- 📊 **Repo Analysis**: Provides real-time status on dirty working trees, unpushed commits, and active branches.
- 🛡️ **Safe Delete**: Prevents accidental data loss by blocking deletion of unsynced or modified repositories.
- 📂 **Native Integration**: Open any repository instantly in your system's file manager.
- 🎨 **Modern Dashboard**: Clean, premium interface with powerful filtering capabilities.
- 📦 **Cross-Platform**: Ready for Windows, macOS, and Linux.

## Tech Stack

- **Backend**: Rust, Tauri v2, `git2-rs`, `ignore`
- **Frontend**: React, TypeScript, Redux Toolkit (RTK Query), Tailwind CSS v4, Shadcn UI
- **CI/CD**: GitHub Actions with `tauri-action`

## Getting Started

For detailed installation instructions, please refer to the **[Installation Guide](INSTALL.md)**.

### Quick Start (Developers)
```bash
npm install
npm run tauri dev
```

## Documentation

Full documentation is available at: **[https://abiramank.github.io/GitExodus/](https://abiramank.github.io/GitExodus/)**

- 🛠️ **[Installation Guide](INSTALL.md)**: Steps for commercial users and developers.
- 🤝 **[Contributing Guide](CONTRIBUTING.md)**: How to contribute to GitExodus.
- 📜 **[Code of Conduct](CODE_OF_CONDUCT.md)**: Our community standards.
- 🛡️ **[Security Policy](SECURITY.md)**: How to report vulnerabilities.
- 🆘 **[Support](SUPPORT.md)**: How to get help.
- 📜 **[License](LICENSE)**: MIT License.

## Additional Resources
- 📊 **[Release Notes](RELEASES.md)**: Version-by-version change log.
- [Session History](SESSION_HISTORY.md)
- [Task List & Roadmap](TASKS.md)

## License
Built with ❤️ and released under the **[MIT License](LICENSE)**.
