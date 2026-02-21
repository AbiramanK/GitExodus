import { describe, it, expect } from 'vitest';
import uiReducer, { toggleSidebar, setSidebarCollapsed } from '../redux/slices/uiSlice';

describe('uiSlice', () => {
  const initialState = {
    sidebarCollapsed: false,
  };

  it('should handle initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle toggleSidebar', () => {
    const actual = uiReducer(initialState, toggleSidebar());
    expect(actual.sidebarCollapsed).toBe(true);
    const nextActual = uiReducer(actual, toggleSidebar());
    expect(nextActual.sidebarCollapsed).toBe(false);
  });

  it('should handle setSidebarCollapsed', () => {
    const actual = uiReducer(initialState, setSidebarCollapsed(true));
    expect(actual.sidebarCollapsed).toBe(true);
    const nextActual = uiReducer(actual, setSidebarCollapsed(false));
    expect(nextActual.sidebarCollapsed).toBe(false);
  });
});
