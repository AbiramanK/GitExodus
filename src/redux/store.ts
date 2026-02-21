import { configureStore } from '@reduxjs/toolkit';
import { gitApi } from './api/v2/gitApi';
import repoReducer from './slices/repoSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    [gitApi.reducerPath]: gitApi.reducer,
    repos: repoReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
