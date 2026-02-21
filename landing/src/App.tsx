import React from "react";
import { motion } from "framer-motion";
import { Download, Github, Code2, Zap, Layout, Monitor } from "lucide-react";

function App() {
  const getOsName = () => {
    const userAgent = window.navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    if (userAgent.includes("Mac")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    return "Download";
  };

  const os = getOsName();

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Lightning Fast Scanner",
      description: "Powered by Rust, GitExodus scans your entire system for local repositories in milliseconds."
    },
    {
      icon: <Layout className="h-6 w-6 text-blue-400" />,
      title: "GitHub-style Diff Viewer",
      description: "Review your uncommitted changes seamlessly with an integrated, premium code diff interface."
    },
    {
      icon: <Code2 className="h-6 w-6 text-green-400" />,
      title: "Real-time Tracking",
      description: "Live detection of repository state changes, dirty working trees, and unpushed commits."
    },
    {
      icon: <Monitor className="h-6 w-6 text-purple-400" />,
      title: "Open With Integration",
      description: "Automatically detects your installed IDEs like VS Code and IntelliJ to jump straight into code."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            GE
          </div>
          <span className="font-semibold tracking-tight text-white text-lg">GitExodus</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="https://github.com/AbiramanK/GitExodus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 text-sm font-medium inline-block">
            v0.1.0 is now available
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Repo Management. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Redefined.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            GitExodus is a high-performance system utility that discovers, tracks, and manages your Git repositories automatically. Built with Rust and React.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/AbiramanK/GitExodus/releases" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors shadow-lg shadow-green-900/20">
              <Download className="h-5 w-5" />
              Download for {os}
            </a>
            <a href="https://github.com/AbiramanK/GitExodus/releases" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-8 py-4 rounded-md font-semibold text-lg border border-white/10 transition-colors">
              Other platforms
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">Free and open source. Available on macOS, Windows, and Linux.</p>
        </motion.div>

        {/* Screenshot / App Preview */}
        <motion.div 
          className="mt-20 relative w-full rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/10 bg-[#0d1117] aspect-video"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
           {/* Placeholder for screenshot */}
           <div className="absolute inset-0 bg-gradient-to-tr from-[#0d1117] to-[#161b22] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Code2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">GitExodus Dashboard</p>
                <p className="text-sm mt-2 opacity-60">High-performance Rust backend • Beautiful React UI</p>
              </div>
           </div>
        </motion.div>

        {/* Features Grid */}
        <div id="features" className="mt-32 w-full text-left">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Engineered for speed and aesthetics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="p-6 rounded-xl bg-[#161b22] border border-white/5 hover:border-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#21262d] flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="mt-32 w-full max-w-3xl mx-auto text-left">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Fast Installation</h2>
            <div className="bg-[#161b22] p-8 rounded-xl border border-white/10">
                <h3 className="text-lg font-medium text-white mb-4">Linux (Debian/Ubuntu)</h3>
                <pre className="bg-black/50 p-4 rounded-md text-emerald-400 font-mono text-sm overflow-x-auto border border-white/5">
                    <code>wget https://github.com/AbiramanK/GitExodus/releases/latest/download/gitexodus_0.1.0_amd64.deb
sudo dpkg -i gitexodus_0.1.0_amd64.deb</code>
                </pre>
                
                <h3 className="text-lg font-medium text-white mb-4 mt-8">Windows</h3>
                <p className="text-gray-400 mb-2">Download the MSI installer from the <a href="https://github.com/AbiramanK/GitExodus/releases" className="text-blue-400 hover:underline">Releases page</a> and run it.</p>
            </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10 bg-[#0d1117] text-center text-gray-500 text-sm mt-auto">
        <p>© 2026 Abiraman K. Built as an open-source project.</p>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className}>{children}</span>;
}

export default App;
