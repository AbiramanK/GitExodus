import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  GitBranch, 
  GitCommit, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Activity,
  LayoutDashboard,
  RotateCcw
} from 'lucide-react';
import { useScan } from '../hooks/useScan';
import { cn } from '../lib/utils';
import { setCurrentPage } from '../redux/slices/uiSlice';
import { PAGE_ROUTES } from '../configs/pageRoutes';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { repositories, isScanning, handleScan } = useScan(true);
  
  const totalRepos = repositories.length;
  const dirtyRepos = repositories.filter(r => r.is_dirty).length;
  const unpushedRepos = repositories.filter(r => r.has_unpushed_commits).length;
  const cleanRepos = totalRepos - (dirtyRepos + unpushedRepos);

  const stats = [
    { label: 'Total Repositories', value: totalRepos, icon: LayoutDashboard, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Dirty Workspaces', value: dirtyRepos, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Unpushed Changes', value: unpushedRepos, icon: GitCommit, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Clean Status', value: cleanRepos, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-8 space-y-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time health overview of your local development ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-medium active:scale-95 disabled:opacity-50",
                isScanning && "animate-pulse"
            )}
          >
            <RotateCcw className={cn("h-4 w-4", isScanning && "animate-spin")} />
            {isScanning ? "Scanning..." : "Scan"}
          </button>
          <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
              <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-accent text-accent-foreground">Overview</button>
              <button className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-accent/50 text-muted-foreground transition-colors">Activity</button>
          </div>
        </div>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
              </div>
              <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.5%</span> from last scan
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-8 rounded-3xl bg-card border shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Repository Health Distribution
            </h2>
            <select className="bg-transparent border rounded-md text-xs px-2 py-1 outline-none focus:ring-1 ring-primary/20">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end justify-around gap-4 pb-4 border-b relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-t border-dashed w-full h-0"></div>
                <div className="border-t border-dashed w-full h-0"></div>
                <div className="border-t border-dashed w-full h-0"></div>
                <div className="border-t border-dashed w-full h-0"></div>
            </div>

            {[65, 45, 80, 55, 90, 70, 85].map((val, i) => (
              <div key={i} className="group relative flex-1 max-w-10 flex flex-col items-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                  className={cn(
                    "w-full rounded-t-lg transition-all relative overflow-hidden",
                    i % 2 === 0 ? "bg-linear-to-t from-blue-600 to-indigo-500" : "bg-linear-to-t from-purple-600 to-pink-500"
                  )}
                >
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-white/20 blur-xl"></div>
                </motion.div>
                <span className="text-[10px] text-muted-foreground mt-4 font-medium">Day {i + 1}</span>
                <div className="absolute -top-8 bg-popover border px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                    Health: {val}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.6 }}
           className="p-8 rounded-3xl bg-card border shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <GitBranch className="h-24 w-24 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button 
                onClick={() => dispatch(setCurrentPage(PAGE_ROUTES.REPOSITORIES))}
                className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-between hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 group/btn"
            >
              <div className="flex items-center gap-3 text-white">
                <div className="p-2 bg-white/20 rounded-lg">
                    <Folder className="h-5 w-5 text-white" />
                </div>
                Manage Repositories
              </div>
              <Activity className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-opacity text-white" />
            </button>
            <div className="grid grid-cols-2 gap-4">
               <button className="p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors flex flex-col items-center gap-2 border">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium">Branches</span>
               </button>
               <button className="p-4 rounded-xl bg-accent hover:bg-accent/80 transition-colors flex flex-col items-center gap-2 border">
                  <GitCommit className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs font-medium">Commits</span>
               </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t space-y-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System Health</h3>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Git Version</span>
                  <span className="font-mono">2.43.0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Disk Optimized</span>
                  <span className="text-emerald-500 font-medium">Active</span>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Internal components to avoid extra imports for layout
const Folder = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
);
