# GitExodus

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

### Prerequisites
- [Rust & Cargo](https://www.rust-lang.org/learn/get-started#installing-rust)
- [Node.js](https://nodejs.org/)

### Installation
```bash
npm install
```

### Development
```bash
npm run tauri dev
```

### Build
```bash
npm run tauri build
```

## Documentation
- [Session History](SESSION_HISTORY.md)
- [Task List & Roadmap](TASKS.md)

## License
MIT (or as specified in the project)
