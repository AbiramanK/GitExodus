# Installation Guide

GitExodus is built with Tauri, Rust, and React. 

## 🏢 Commercial Users (Pre-built Binaries)

For users who want to use GitExodus without setting up a development environment:

1.  Go to the [GitHub Releases page](https://github.com/AbiramanK/GitExodus/releases).
2.  Download the installer or binary for your operating system (Windows, macOS, or Linux).
3.  Run the installer and follow the on-screen instructions.

## 🛠️ Developer Guide (Self-Build)

If you want to contribute to GitExodus or build it from source:

### Prerequisites

*   **Rust**: Install Rust using `rustup`: [https://rustup.rs/](https://rustup.rs/)
*   **Node.js**: Install Node.js (v18 or higher recommended): [https://nodejs.org/](https://nodejs.org/)
*   **System Dependencies**: 
    *   **Linux**: You'll need several development packages (e.g., `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`).
    *   **Windows**: [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) is usually pre-installed on Windows 10/11.
    *   **macOS**: Xcode Command Line Tools.

### Setup Instructions

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/AbiramanK/GitExodus.git
    cd GitExodus
    ```

2.  **Install Node Dependencies**:
    ```bash
    npm install
    ```

3.  **Run in Development Mode**:
    ```bash
    npm run tauri dev
    ```

4.  **Build Production Binary**:
    ```bash
    npm run tauri build
    ```

The production artifacts will be located in `src-tauri/target/release/bundle/`.
