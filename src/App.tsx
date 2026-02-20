import { DashboardContainer } from "./containers/DashboardContainer";
import { AppSidebar } from "./components/AppSidebar";

function App() {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <DashboardContainer />
      </main>
    </div>
  );
}

export default App;
