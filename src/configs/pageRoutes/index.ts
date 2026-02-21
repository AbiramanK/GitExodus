export const PAGE_ROUTES = {
  DASHBOARD: "dashboard",
  REPOSITORIES: "repositories",
  BRANCHES: "branches",
  COMMITS: "commits",
  SETTINGS: "settings",
};

export const sidebarItems = [
  {
    title: "Dashboard",
    path: PAGE_ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    title: "Repositories",
    path: PAGE_ROUTES.REPOSITORIES,
    icon: "Folder",
  },
  {
    title: "Branches",
    path: PAGE_ROUTES.BRANCHES,
    icon: "GitBranch",
  },
  {
    title: "Commits",
    path: PAGE_ROUTES.COMMITS,
    icon: "History",
  },
  {
    title: "Settings",
    path: PAGE_ROUTES.SETTINGS,
    icon: "Settings",
  },
];
