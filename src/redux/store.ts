import { configureStore } from '@reduxjs/toolkit';
import { gitApi } from './api/v2/gitApi';

export const store = configureStore({
  reducer: {
    [gitApi.reducerPath]: gitApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
