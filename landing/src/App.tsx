import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Github, Code2, Zap, Layout, Monitor, Rocket, GitMerge, ChevronLeft, ChevronRight } from "lucide-react";

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
      icon: <Rocket className="h-6 w-6 text-indigo-400" />,
      title: "Universal Sync",
      description: "One-click backup for all dirty and unpushed repositories across your entire system."
    },
    {
      icon: <GitMerge className="h-6 w-6 text-pink-400" />,
      title: "Smart Bulk Actions",
      description: "Multi-select repositories to perform batch commits and pushes with ease."
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-400" />,
      title: "Multi-root Scanning",
      description: "Manage disparate repository collections by adding multiple custom scan roots across your system."
    },
    {
      icon: <Layout className="h-6 w-6 text-blue-400" />,
      title: "Analytics Dashboard",
      description: "Visualize ecosystem health with real-time statistics, charts, and repository tracking."
    },
    {
      icon: <Monitor className="h-6 w-6 text-purple-400" />,
      title: "Smart Exit Guard",
      description: "Custom confirmation dialogs for both window close and sidebar exit to prevent accidental data loss."
    },
    {
      icon: <Code2 className="h-6 w-6 text-green-400" />,
      title: "Geometric Branding",
      description: "A premium software identity with high-fidelity neon-enhanced bird logos and high-DPI favicons."
    }
  ];

  const screenshots = [
    {
      id: 'dashboard',
      src: "./screenshots/dashboard.png",
      alt: "GitExodus Dashboard",
      title: "Powerful Dashboard"
    },
    {
      id: 'diff',
      src: "./screenshots/diffviewer.png",
      alt: "GitExodus Diff Viewer",
      title: "GitHub-style Diff"
    },
    {
      id: 'bulk',
      src: "./screenshots/bulk_actions.png",
      alt: "GitExodus Bulk Actions",
      title: "Smart Bulk Operations"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 overflow-hidden shrink-0">
            <img src="logo.png" alt="GitExodus Logo" className="w-full h-full object-contain scale-125" />
          </div>
          <span className="font-semibold tracking-tight text-white text-xl">GitExodus</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
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
            v0.3.0 is now available
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
            Repo Management. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              Redefined.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            GitExodus is a high-performance system utility that discovers, tracks, and manages your Git repositories automatically. Built with Rust and React.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://github.com/AbiramanK/GitExodus/releases" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-md font-semibold text-lg transition-colors shadow-lg shadow-green-900/20">
              <Download className="h-5 w-5" />
              Download for {os}
            </a>
            <a href="https://github.com/AbiramanK/GitExodus/releases" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-secondary hover:bg-[#30363d] text-gray-300 px-8 py-4 rounded-md font-semibold text-lg border border-white/10 transition-colors">
              Other platforms
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-500">Free and open source. Available on macOS, Windows, and Linux.</p>
        </motion.div>

        {/* Screenshot Carousel */}
        <section className="mt-20 w-full group">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10 bg-background aspect-video">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 p-2"
              >
                <div className="flex items-center justify-center">
                <img 
                   src={screenshots[currentIndex].src} 
                   alt={screenshots[currentIndex].alt}
                   className="w-fit h-fit object-cover rounded-xl"
                />
                </div>
                
                {/* Caption Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10">
                        <span className="text-white font-medium text-sm">{screenshots[currentIndex].title}</span>
                    </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-background/40 via-transparent to-transparent" />

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
                <ChevronRight className="h-5 w-5" />

            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-blue-500 w-8' : 'bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <div id="features" className="mt-32 w-full text-left">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Engineered for speed and aesthetics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                className="p-6 rounded-xl bg-secondary-hover border border-white/5 hover:border-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Documentation Section */}
        <DocumentationSection />

        {/* Release Notes */}
        <div className="mt-32 w-full text-left">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">v0.3.0 Release Notes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-[#161b22] border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Layout className="h-5 w-5 text-blue-400" />
                Granular Control
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Hunk Discard:</strong> Revert specific code segments within a file with industry-standard precision.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Segmented Diff:</strong> New diff viewer design with inline discard actions and collapsible hunks.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-500">•</span>
                  <span><strong>Back Navigation:</strong> Simplified header navigation with a dedicated "Back" button.</span>
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-xl bg-[#161b22] border border-white/5">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Monitor className="h-5 w-5 text-purple-400" />
                Onboarding & Docs
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span><strong>Interactive Docs:</strong> Comprehensive installation and developer guides directly on the landing page.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span><strong>Developer Onboarding:</strong> Detailed PR guidelines, branch naming, and project setup instructions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-500">•</span>
                  <span><strong>Standardized Undo:</strong> Unified iconography across the app for all revert operations.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-8 border-t border-white/10 bg-background text-center text-gray-500 text-sm mt-auto">
        <p>© 2026 Abiraman K. Built as an open-source project.</p>
      </footer>
    </div>
  );
}

function DocumentationSection() {
    const [activeTab, setActiveTab] = useState<'user' | 'developer'>('user');

    return (
        <div id="docs" className="mt-32 w-full max-w-4xl mx-auto text-left">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Documentation</h2>
            
            <div className="flex items-center justify-center p-1 bg-white/5 rounded-lg border border-white/10 w-fit mx-auto mb-10">
                <button 
                  onClick={() => setActiveTab('user')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'user' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    User Guide
                </button>
                <button 
                  onClick={() => setActiveTab('developer')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'developer' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Developer Guide
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'user' ? (
                    <motion.div 
                        key="user"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-10"
                    >
                        <div className="bg-[#161b22] p-8 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Monitor className="h-5 w-5 text-blue-400" />
                                Installation
                            </h3>
                            
                            <div className="space-y-8">
                                    <div>
                                        <h4 className="text-md font-medium text-gray-200 mb-3 ml-1">Linux (Debian/Ubuntu)</h4>
                                        <pre className="bg-black/50 p-4 rounded-md text-emerald-400 font-mono text-sm overflow-x-auto border border-white/5">
                                            <code>wget https://github.com/AbiramanK/GitExodus/releases/latest/download/gitexodus_0.3.0_amd64.deb
sudo dpkg -i gitexodus_0.3.0_amd64.deb</code>
                                        </pre>
                                    </div>
                                
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <h4 className="text-md font-medium text-gray-200 mb-2">Windows</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Download the <code>.msi</code> installer from the <a href="https://github.com/AbiramanK/GitExodus/releases" className="text-blue-400 hover:underline">Releases</a> page and follow the setup wizard.
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                        <h4 className="text-md font-medium text-gray-200 mb-2">macOS</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            Grab the <code>.dmg</code> file from GitHub, open it, and drag <strong>GitExodus</strong> to your Applications folder.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 rounded-xl border border-white/5 bg-[#161b22]/50">
                                <h3 className="text-lg font-semibold text-white mb-3">System Requirements</h3>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex gap-2"><span>•</span> 64-bit multi-core processor</li>
                                    <li className="flex gap-2"><span>•</span> 4GB RAM (8GB recommended)</li>
                                    <li className="flex gap-2"><span>•</span> Git installed on system PATH</li>
                                </ul>
                            </div>
                            <div className="p-6 rounded-xl border border-white/5 bg-[#161b22]/50">
                                <h3 className="text-lg font-semibold text-white mb-3">Post-Install Tip</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    After launching, go to <strong>Settings</strong> to add your base repository folders. GitExodus will then index and track them automatically.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="developer"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-10"
                    >
                        <div className="bg-[#161b22] p-8 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Code2 className="h-5 w-5 text-emerald-400" />
                                Project Setup
                            </h3>
                            
                            <div className="space-y-6">
                                <p className="text-sm text-gray-400">
                                    Ensure you have <strong>Node.js 18+</strong> and <strong>Rust</strong> (latest stable) installed before proceeding.
                                </p>
                                
                                <div>
                                    <h4 className="text-md font-medium text-gray-200 mb-3 ml-1">1. Clone & Install</h4>
                                    <pre className="bg-black/50 p-4 rounded-md text-emerald-400 font-mono text-sm overflow-x-auto border border-white/5">
                                        <code>git clone https://github.com/AbiramanK/GitExodus.git
cd GitExodus
npm install</code>
                                    </pre>
                                </div>

                                <div>
                                    <h4 className="text-md font-medium text-gray-200 mb-3 ml-1">2. Run Dev Server</h4>
                                    <pre className="bg-black/50 p-4 rounded-md text-emerald-400 font-mono text-sm overflow-x-auto border border-white/5">
                                        <code>npm run tauri dev</code>
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#161b22] p-8 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-6">Contribution Guidelines (PRs)</h3>
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-200">Branch Naming</h4>
                                    <ul className="space-y-2 text-sm text-gray-400 font-mono">
                                        <li>feat/short-desc</li>
                                        <li>fix/issue-desc</li>
                                        <li>refactor/target</li>
                                    </ul>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-md font-medium text-gray-200">Commit Standards</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        We use <strong>Conventional Commits</strong>. Examples:<br/>
                                        <code>feat: add hunk support</code><br/>
                                        <code>fix: sidebar layout bugs</code>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-8 border-t border-white/5 text-sm text-gray-400">
                                <p><strong>REQUIRED for PR approval:</strong> Ensure <code>cargo fmt</code> has been run and there are no TypeScript lint errors. All tests should pass (<code>npm test</code>).</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className}>{children}</span>;
}

export default App;
