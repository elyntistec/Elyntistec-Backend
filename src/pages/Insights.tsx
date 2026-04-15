import { useState } from "react";
import { Filter, Play, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stages = ["dedupe", "normalize", "outlier filter", "schema validate"] as const;

export default function Insights() {
  const [dirty, setDirty] = useState(12_400);
  const [clean, setClean] = useState(98_200);
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [log, setLog] = useState<string[]>(["Queue ready."]);

  const runPipeline = () => {
    if (running || dirty === 0) return;
    setRunning(true);
    setStageIndex(0);
    setLog((l) => [...l, "Pipeline started."]);
    let i = 0;
    const advance = () => {
      if (i >= stages.length) {
        const batch = Math.min(4_000, dirty);
        setDirty((d) => Math.max(0, d - batch));
        setClean((c) => c + batch);
        setRunning(false);
        setStageIndex(-1);
        setLog((l) => [...l, `Committed ${batch.toLocaleString()} clean rows.`]);
        return;
      }
      setStageIndex(i);
      setLog((l) => [...l, `${stages[i]}…`]);
      i += 1;
      setTimeout(advance, 650);
    };
    advance();
  };

  const resetDemo = () => {
    if (running) return;
    setDirty(12_400);
    setClean(98_200);
    setLog(["Queue reset."]);
  };

  const progressPct = running && stageIndex >= 0 ? ((stageIndex + 1) / stages.length) * 100 : 0;

  return (
    <DashboardLayout
      title="Automated cleaning & processing"
      subtitle="Deduplicate, normalize, and validate industrial data streams"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Filter className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Processing queue</h2>
              <p className="text-xs text-muted-foreground">Demo counters update when a batch completes.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Pending / dirty</p>
              <p className="text-xl font-semibold tabular-nums text-warning">{dirty.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Clean output</p>
              <p className="text-xl font-semibold tabular-nums text-primary">{clean.toLocaleString()}</p>
            </div>
          </div>
          {running && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Stage</span>
                <span>
                  {stageIndex >= 0 && stageIndex < stages.length
                    ? stages[stageIndex]
                    : "Finishing…"}
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-xl btn-glow" onClick={runPipeline} disabled={running || dirty === 0}>
              <Play className="h-4 w-4 mr-2" />
              Run pipeline
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={resetDemo} disabled={running}>
              <Trash2 className="h-4 w-4 mr-2" />
              Reset demo
            </Button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-3">
          <h3 className="text-sm font-medium text-foreground">Activity log</h3>
          <ul className="rounded-xl border border-border/40 bg-background/50 max-h-72 overflow-y-auto text-xs font-mono p-3 space-y-1.5">
            {log.slice(-20).map((line, i) => (
              <li key={`${line}-${i}`} className="text-muted-foreground">
                <span className="text-primary/80 mr-2">▸</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
