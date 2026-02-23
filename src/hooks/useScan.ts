import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { homeDir } from '@tauri-apps/api/path';
import { RootState } from '../redux/store';
import { startScan, addRepo, finishScan, setScanError } from '../redux/slices/repoSlice';
import { RepositoryInfo } from '../redux/api/v2/apiResponse';

export const useScan = (autoScanOnEmpty: boolean = false) => {
  const dispatch = useDispatch();
  const { repositories, isScanning, scanRoots } = useSelector((state: RootState) => state.repos);

  const handleScan = useCallback(async () => {
    if (isScanning) return;
    
    dispatch(startScan());
    try { 
      let rootsList = [...scanRoots];
      if (rootsList.length === 0) {
        const home = await homeDir();
        rootsList = [home];
      }
      await invoke('scan_repos', { rootPaths: rootsList }); 
    }
    catch (error) { 
      dispatch(setScanError(error as string)); 
    }
  }, [dispatch, isScanning, scanRoots]);

  useEffect(() => {
    let unlistenStarted: (() => void) | undefined;
    let unlistenDetected: (() => void) | undefined;
    let unlistenFinished: (() => void) | undefined;

    const setupListeners = async () => {
      unlistenStarted = await listen('scan-started', () => dispatch(startScan()));
      unlistenDetected = await listen<RepositoryInfo>('repo-detected', (e) => dispatch(addRepo(e.payload)));
      unlistenFinished = await listen('scan-finished', () => dispatch(finishScan()));
    };

    setupListeners();

    return () => {
      if (unlistenStarted) unlistenStarted();
      if (unlistenDetected) unlistenDetected();
      if (unlistenFinished) unlistenFinished();
    };
  }, [dispatch]);

  useEffect(() => {
    if (autoScanOnEmpty && repositories.length === 0 && !isScanning) {
      handleScan();
    }
  }, [autoScanOnEmpty, repositories.length, isScanning, handleScan]);

  return {
    repositories,
    isScanning,
    handleScan,
    scanRoots
  };
};
