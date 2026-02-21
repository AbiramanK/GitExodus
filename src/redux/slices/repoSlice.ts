import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RepositoryInfo } from '../api/v2/apiResponse';

interface RepoState {
  repositories: RepositoryInfo[];
  isScanning: boolean;
  scanError: string | null;
}

const initialState: RepoState = {
  repositories: [],
  isScanning: false,
  scanError: null,
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
      // Avoid duplicates just in case
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
    }
  },
});

export const { startScan, addRepo, finishScan, setScanError, updateRepo, removeRepo } = repoSlice.actions;
export default repoSlice.reducer;
