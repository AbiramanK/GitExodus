import { LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen, Settings, Folder, GitBranch, History, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarItems } from '../configs/pageRoutes';
import { cn } from '../lib/utils';
import { RootState } from '../redux/store';
import { toggleSidebar, setCurrentPage } from '../redux/slices/uiSlice';
import { useTheme } from './ThemeProvider';

const IconMap: { [key: string]: any } = {
  LayoutDashboard: LayoutDashboard,
  Settings: Settings,
  Folder: Folder,
  GitBranch: GitBranch,
  History: History,
};

export const AppSidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);
  const currentPage = useSelector((state: RootState) => state.ui.currentPage);
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <div 
      data-testid="app-sidebar"
      className={cn(
        "h-screen border-r bg-card flex flex-col sticky top-0 flex-shrink-0 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
          "p-6 border-b flex items-center justify-between overflow-hidden",
          collapsed && "px-4"
      )}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="h-10 w-10 overflow-hidden shrink-0">
            <img src="/logo.png" alt="GitExodus" className="h-full w-full object-contain scale-125" />
          </div>
          {!collapsed && <h2 className="text-xl font-bold text-primary truncate">GitExodus</h2>}
        </div>
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {sidebarItems.map((item) => {
          const Icon = IconMap[item.icon] || LayoutDashboard;
          return (
            <div 
              key={item.path}
              onClick={() => dispatch(setCurrentPage(item.path))}
              className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer",
                  item.path === currentPage ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50",
                  collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.title : ""}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="text-sm font-medium truncate">{item.title}</span>}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t space-y-2">
        <div 
          onClick={() => setTheme(theme === "dark" || theme === "system" ? "light" : "dark")}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Toggle Theme" : ""}
        >
          {resolvedTheme === "dark" ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
          {!collapsed && <span className="text-sm font-medium truncate">Theme Switch</span>}
        </div>
        <div 
          onClick={() => {
            import("@tauri-apps/api/event").then(({ emit }) => {
              emit("request-exit");
            });
          }}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Exit Application" : ""}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium truncate">Exit</span>}
        </div>
      </div>
    </div>
  );
};
