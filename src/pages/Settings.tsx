import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { addScanRoot, removeScanRoot } from '../redux/slices/repoSlice';
import { Button } from '../components/ui/core';
import { FolderOpen, Trash2, Plus, Settings as SettingsIcon } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';

export const Settings = () => {
  const dispatch = useDispatch();
  const { scanRoots } = useSelector((state: RootState) => state.repos);

  const handleAddRoot = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select a directory to scan for repositories'
      });
      if (selected && typeof selected === 'string') {
        dispatch(addScanRoot(selected));
      }
    } catch (error) {
      console.error('Failed to open directory dialog:', error);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground">Manage your application configuration and scanning roots.</p>
      </div>

      <div className="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Scanning Roots</h2>
            <p className="text-sm text-muted-foreground">Directories where GitExodus will look for local repositories.</p>
          </div>
          <Button onClick={handleAddRoot} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Root
          </Button>
        </div>

        <div className="space-y-3">
          {scanRoots.length === 0 ? (
            <div className="text-center py-10 border border-dashed rounded-lg bg-accent/5">
              <FolderOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground italic">No scanning roots added yet. Add one to start discovery.</p>
            </div>
          ) : (
            scanRoots.map((root) => (
              <div key={root} className="flex items-center justify-between p-3 rounded-lg bg-accent/20 border group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FolderOpen className="h-4 w-4 text-blue-500 shrink-0" />
                  <span className="text-sm font-medium truncate font-mono text-muted-foreground">{root}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => dispatch(removeScanRoot(root))}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-4 border-t text-sm text-muted-foreground">
          <p>Version: 0.1.0-alpha</p>
      </div>
    </div>
  );
};
