import { useEffect, useState } from "react";
import { Download, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOps, type OpsEnv } from "@/context/OpsContext";

type DashboardHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function DashboardHeader({
  title = "Command Center",
  subtitle = "AI-Powered Analytics Dashboard",
}: DashboardHeaderProps) {
  const [time, setTime] = useState(new Date());
  const { env, setEnv, syncing, runSync, exportSnapshot, status, lastSyncAt } = useOps();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-3 pl-16 pr-4 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-border/35 bg-background/70 backdrop-blur-xl">
      <div className="min-w-0">
        <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
        <p className="hidden sm:block text-[11px] md:text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      <div className="hidden sm:flex w-full sm:w-auto items-center gap-2 md:gap-3 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
        <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-xl bg-card/55 border border-border/40 shrink-0">
          <span className="text-xs text-muted-foreground">Environment</span>
          <select
            value={env}
            onChange={(e) => setEnv(e.target.value as OpsEnv)}
            className="bg-transparent text-sm text-foreground outline-none"
          >
            <option className="bg-card" value="Factory A">Factory A</option>
            <option className="bg-card" value="Factory B">Factory B</option>
            <option className="bg-card" value="Staging">Staging</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-xl bg-card/45 border border-border/40 shrink-0">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <Badge
            variant={status === "Stable" ? "default" : "secondary"}
            className="rounded-full"
          >
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground tabular-nums">
            {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {lastSyncAt && (
            <span className="text-[10px] text-muted-foreground/80 border border-border/50 bg-muted/20 px-2 py-0.5 rounded-full">
              synced {lastSyncAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl h-10 shrink-0"
          onClick={runSync}
          disabled={syncing}
        >
          <RefreshCw className={`h-4 w-4 sm:mr-2 ${syncing ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{syncing ? "Syncing" : "Sync Data"}</span>
        </Button>

        <Button variant="secondary" size="sm" className="rounded-xl h-10 shrink-0" onClick={exportSnapshot}>
          <Download className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
}
