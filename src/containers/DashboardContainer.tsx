import { Dashboard } from "../pages/Dashboard";
import { Provider } from "react-redux";
import { store } from "../redux/store";

export const DashboardContainer = () => {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
};
