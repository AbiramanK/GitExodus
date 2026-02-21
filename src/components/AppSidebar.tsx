import { LayoutDashboard, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarItems } from '../configs/pageRoutes';
import { cn } from '../lib/utils';
import { RootState } from '../redux/store';
import { toggleSidebar } from '../redux/slices/uiSlice';

export const AppSidebar = () => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state: RootState) => state.ui.sidebarCollapsed);

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
        {!collapsed && <h2 className="text-xl font-bold text-primary truncate">GitExodus</h2>}
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="p-1 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {sidebarItems.map((item) => (
          <div 
            key={item.path}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all cursor-pointer",
                item.path === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50",
                collapsed && "justify-center px-0"
            )}
            title={collapsed ? item.title : ""}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="text-sm font-medium truncate">{item.title}</span>}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t overflow-hidden">
        <div 
          className={cn(
              "flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer transition-all",
              collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Exit" : ""}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Exit</span>}
        </div>
      </div>
    </div>
  );
};
