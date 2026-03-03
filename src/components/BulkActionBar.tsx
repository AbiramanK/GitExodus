import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCommit, ArrowUpCircle, GitMerge, X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/core";
import { BulkResult } from "../redux/api/v2/apiResponse";

interface BulkActionBarProps {
  selectedCount: number;
  selectedPaths: string[];
  onBulkCommit: (paths: string[], message: string) => Promise<BulkResult | undefined>;
  onBulkPush: (paths: string[]) => void;
  onClearSelection: () => void;
}

type BulkStatus = "idle" | "loading" | "success" | "error";

export const BulkActionBar = ({
  selectedCount,
  selectedPaths,
  onBulkCommit,
  onBulkPush,
  onClearSelection,
}: BulkActionBarProps) => {
  const [commitMsg, setCommitMsg] = useState("");
  const [showCommitInput, setShowCommitInput] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<BulkStatus>("idle");
  const [bulkResult, setBulkResult] = useState<BulkResult | null>(null);

  const handleBulkAction = async () => {
    if (!commitMsg.trim()) return;
    setBulkStatus("loading");
    try {
      const result = await onBulkCommit(selectedPaths, commitMsg.trim());
      if (result) {
        setBulkResult(result);
        setBulkStatus(result.failed === 0 ? "success" : "error");
      }
    } catch {
      setBulkStatus("error");
    } finally {
      setCommitMsg("");
      setShowCommitInput(false);
      setTimeout(() => { setBulkStatus("idle"); setBulkResult(null); }, 5000);
    }
  };

  const handlePushSelected = () => {
    onBulkPush(selectedPaths);
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          key="bulk-bar"
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
        >
          <div className="bg-card border border-border shadow-2xl rounded-xl px-5 py-3 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold">
                  {selectedCount}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {selectedCount} repo{selectedCount !== 1 ? "s" : ""} selected
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => { setShowCommitInput(v => !v); }} className="gap-1.5 text-xs">
                  <GitCommit className="h-3.5 w-3.5" /> Commit
                </Button>
                <Button size="sm" variant="outline" onClick={handlePushSelected} className="gap-1.5 text-xs">
                  <ArrowUpCircle className="h-3.5 w-3.5" /> Push
                </Button>
                <Button size="sm" variant="default" onClick={() => { setShowCommitInput(v => !v); }} className="gap-1.5 text-xs text-white">
                  <GitMerge className="h-3.5 w-3.5" /> Commit &amp; Push
                </Button>
                <Button size="icon" variant="ghost" onClick={onClearSelection} title="Clear Selection" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showCommitInput && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    placeholder={`Standard commit message...`}
                    value={commitMsg}
                    onChange={(e) => setCommitMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleBulkAction()}
                    className="flex-1 h-8 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <Button size="sm" onClick={handleBulkAction} disabled={!commitMsg.trim() || bulkStatus === "loading"} className="h-8 text-xs gap-1.5">
                    {bulkStatus === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GitCommit className="h-3.5 w-3.5" />}
                    Confirm
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {bulkResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`flex items-center gap-2 text-xs rounded-md px-3 py-2 ${bulkResult.failed === 0 ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"}`}>
                  {bulkResult.failed === 0 ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 shrink-0" />}
                  <span>{bulkResult.succeeded}/{bulkResult.total} succeeded</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
