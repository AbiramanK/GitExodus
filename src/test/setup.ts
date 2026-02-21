import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Global Tauri Mocks Registry
(globalThis as any)._tauriListeners = {};

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn((event: string, callback: (event: any) => void) => {
    const listeners = (globalThis as any)._tauriListeners;
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
    return Promise.resolve(() => {
      listeners[event] = listeners[event].filter((cb: any) => cb !== callback);
    });
  })
}));

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(() => Promise.resolve()),
}));

vi.mock('@tauri-apps/api/path', () => ({
  homeDir: vi.fn(() => Promise.resolve('/home/user'))
}));

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
  (globalThis as any)._tauriListeners = {};
});
