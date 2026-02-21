import { useState } from 'react';
import { useGetAvailableAppsQuery, useOpenWithMutation, useOpenFolderMutation } from '../redux/api/v2/gitApi';
import { FolderOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from './ui/core';
import { cn } from '../lib/utils';

interface OpenWithMenuProps {
  path: string;
}

export const OpenWithMenu = ({ path }: OpenWithMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: apps, isLoading } = useGetAvailableAppsQuery();
  const [openWith] = useOpenWithMutation();
  const [openFolder] = useOpenFolderMutation();

  const handleOpenDefault = () => {
    openFolder(path);
    setIsOpen(false);
  };

  const handleOpenWith = (binary: string) => {
    openWith({ path, binary });
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center -space-x-px">
        <Button 
          size="icon" 
          variant="ghost" 
          title="Open in File Manager" 
          onClick={handleOpenDefault}
          className="rounded-r-none border-r-0"
        >
          <FolderOpen className="h-4 w-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          className="w-6 px-0 rounded-l-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card border border-border ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={handleOpenDefault}
              className="group flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
              role="menuitem"
            >
              <FolderOpen className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
              Default File Manager
            </button>
            
            {isLoading ? (
                <div className="px-4 py-2 text-xs text-muted-foreground italic">Detecting apps...</div>
            ) : apps && apps.length > 0 ? (
                <>
                    <div className="border-t border-border my-1" />
                    <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                        Available Applications
                    </div>
                    {apps.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => handleOpenWith(app.binary)}
                            className="group flex items-center w-full px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground text-left"
                            role="menuitem"
                        >
                            <ExternalLink className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                            {app.name}
                        </button>
                    ))}
                </>
            ) : (
                <div className="px-4 py-2 text-xs text-muted-foreground italic">No other apps detected</div>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
