import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { AppSidebar } from "./components/AppSidebar";
import { Dashboard } from "./pages/Dashboard";
import { Repositories } from "./pages/Repositories";
import { Settings } from "./pages/Settings";
import { PAGE_ROUTES } from "./configs/pageRoutes";
import { ExitConfirmDialog } from "./components/ExitConfirmDialog";
import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const currentPage = useSelector((state: RootState) => state.ui.currentPage);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    const unlisten = listen("request-exit", () => {
      setShowExitDialog(true);
    });
    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleExit = () => {
    invoke("exit_app");
  };

  const renderPage = () => {
    switch (currentPage) {
      case PAGE_ROUTES.DASHBOARD:
        return <Dashboard />;
      case PAGE_ROUTES.REPOSITORIES:
        return <Repositories />;
      case PAGE_ROUTES.SETTINGS:
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground flex-col gap-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">{currentPage}</h2>
              <p>This module is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto relative">
        {renderPage()}
      </main>
      <ExitConfirmDialog 
        isOpen={showExitDialog} 
        onOpenChange={setShowExitDialog} 
        onConfirm={handleExit} 
      />
    </div>
  );
}

export default App;
