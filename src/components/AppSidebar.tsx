import { LayoutDashboard, LogOut } from 'lucide-react';
import { sidebarItems } from '../configs/pageRoutes';
import { cn } from '../lib/utils';

export const AppSidebar = () => {
  return (
    <div className="w-64 h-screen border-r bg-card flex flex-col sticky top-0 flex-shrink-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">GitExodus</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <div 
            key={item.path}
            className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer",
                item.path === "/" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">{item.title}</span>
          </div>
        ))}
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Exit</span>
        </div>
      </div>
    </div>
  );
};
