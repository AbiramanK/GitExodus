---
description: Steps to create a new module in the GitExodus project
---

When creating a new module, you MUST follow these steps in order:

1. **Define API Response**: Add the necessary types to `src/redux/api/v2/apiResponse.tsx`.
2. **Create Redux API Slice**: Implement the CRUD operations in a new or existing slice under `src/redux/api/v2/`.
3. **Data Table Hook**: Create a custom hook for managing table state under `src/hooks/table/v2/`.
4. **Main Page Component**: Create the page view in `src/pages/`.
5. **Container Components**: Create container logic for the page and forms in `src/containers/`.
6. **Register Routes**: Define and register the new routes in `src/configs/pageRoutes/`.
7. **Sidebar Integration**: Add the new page to `src/components/AppSidebar.tsx` for navigation.
