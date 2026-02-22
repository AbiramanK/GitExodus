import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import type { RootState } from '../redux/store'
import { Provider } from 'react-redux'
import repoReducer from '../redux/slices/repoSlice'
import uiReducer from '../redux/slices/uiSlice'
import { gitApi } from '../redux/api/v2/gitApi'
import { ThemeProvider } from '../components/ThemeProvider'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: ReturnType<typeof createTestStore>
}

function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      [gitApi.reducerPath]: gitApi.reducer,
      repos: repoReducer,
      ui: uiReducer,
    } as any,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(gitApi.middleware as any) as any,
  })
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.ReactElement {
    return (
      <Provider store={store as any}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </Provider>
    )
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
