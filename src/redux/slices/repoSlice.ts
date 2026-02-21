import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RepositoryInfo } from '../api/v2/apiResponse';

interface RepoState {
  repositories: RepositoryInfo[];
  isScanning: boolean;
  scanError: string | null;
  scanRoots: string[];
}

const STORAGE_KEY = 'git-exodus-scan-roots';

const loadRoots = (): string[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

const initialState: RepoState = {
  repositories: [],
  isScanning: false,
  scanError: null,
  scanRoots: loadRoots(),
};

const repoSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    startScan: (state) => {
      state.repositories = [];
      state.isScanning = true;
      state.scanError = null;
    },
    addRepo: (state, action: PayloadAction<RepositoryInfo>) => {
      if (!state.repositories.find(r => r.path === action.payload.path)) {
        state.repositories.push(action.payload);
      }
    },
    finishScan: (state) => {
      state.isScanning = false;
    },
    setScanError: (state, action: PayloadAction<string>) => {
      state.scanError = action.payload;
      state.isScanning = false;
    },
    updateRepo: (state, action: PayloadAction<RepositoryInfo>) => {
      const index = state.repositories.findIndex(r => r.path === action.payload.path);
      if (index !== -1) {
        state.repositories[index] = action.payload;
      }
    },
    removeRepo: (state, action: PayloadAction<string>) => {
      state.repositories = state.repositories.filter(r => r.path !== action.payload);
    },
    addScanRoot: (state, action: PayloadAction<string>) => {
      if (!state.scanRoots.includes(action.payload)) {
        state.scanRoots.push(action.payload);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scanRoots));
      }
    },
    removeScanRoot: (state, action: PayloadAction<string>) => {
      state.scanRoots = state.scanRoots.filter(r => r !== action.payload);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scanRoots));
    },
    setScanRoots: (state, action: PayloadAction<string[]>) => {
      state.scanRoots = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.scanRoots));
    }
  },
});

export const { 
    startScan, addRepo, finishScan, setScanError, updateRepo, removeRepo, 
    addScanRoot, removeScanRoot, setScanRoots 
} = repoSlice.actions;
export default repoSlice.reducer;
