import { DashboardContainer } from "./containers/DashboardContainer";
import { AppSidebar } from "./components/AppSidebar";

function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardContainer />
      </main>
    </div>
  );
}

export default App;
