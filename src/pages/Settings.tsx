import DashboardLayout from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function Settings() {
  const [compactMode, setCompactMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  return (
    <DashboardLayout title="Settings" subtitle="Personalize your operator experience">
      <div className="glass-card p-6 space-y-6 max-w-2xl">
        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-foreground">Preferences</h2>
          <p className="text-xs text-muted-foreground">These are local-only demo settings.</p>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-4">
          <div className="space-y-0.5">
            <Label className="text-sm">Compact layout</Label>
            <p className="text-xs text-muted-foreground">Reduce spacing in dashboards and lists.</p>
          </div>
          <Switch checked={compactMode} onCheckedChange={setCompactMode} />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-card/40 p-4">
          <div className="space-y-0.5">
            <Label className="text-sm">Auto sync</Label>
            <p className="text-xs text-muted-foreground">Periodically refresh demo telemetry in the UI.</p>
          </div>
          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
        </div>
      </div>
    </DashboardLayout>
  );
}

