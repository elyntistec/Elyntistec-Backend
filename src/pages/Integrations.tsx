import { useState } from "react";
import { Bot, Zap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Rule = { id: string; name: string; description: string; enabled: boolean };

const initialRules: Rule[] = [
  {
    id: "r1",
    name: "Ticket → CMMS",
    description: "Create work order when vibration exceeds threshold",
    enabled: true,
  },
  {
    id: "r2",
    name: "Shift handoff digest",
    description: "Email summary 10 minutes before crew change",
    enabled: false,
  },
  {
    id: "r3",
    name: "Data lake compaction",
    description: "Trigger nightly compaction after ETL success",
    enabled: true,
  },
];

export default function Integrations() {
  const [rules, setRules] = useState(initialRules);
  const [runs, setRuns] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const toggle = (id: string) => {
    setRules((r) => r.map((x) => (x.id === id ? { ...x, enabled: !x.enabled } : x)));
  };

  const dryRun = () => {
    const active = rules.filter((r) => r.enabled).length;
    setRuns((n) => n + 1);
    setLastMessage(`Dry run complete: ${active} active rule(s) would fire (demo).`);
  };

  const activeCount = rules.filter((r) => r.enabled).length;

  return (
    <DashboardLayout
      title="Workflow automation & optimization"
      subtitle="Enable rules, simulate runs, and tune handoffs between systems"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Automation rules</h2>
              <p className="text-xs text-muted-foreground">Switches update immediately in this session.</p>
            </div>
          </div>
          <ul className="space-y-3">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border/40 p-4 bg-card/40"
              >
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium text-foreground">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={rule.id} className="text-xs text-muted-foreground cursor-pointer">
                    {rule.enabled ? "On" : "Off"}
                  </Label>
                  <Switch id={rule.id} checked={rule.enabled} onCheckedChange={() => toggle(rule.id)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-6 space-y-5">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Active rules</p>
            <p className="text-3xl font-semibold tabular-nums text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground mt-1">of {rules.length} configured</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Dry runs (session)</p>
            <p className="text-xl font-medium tabular-nums text-primary">{runs}</p>
          </div>
          <Button className="w-full rounded-xl" variant="secondary" onClick={dryRun}>
            Simulate dry run
          </Button>
          {lastMessage && (
            <p className="text-xs text-primary leading-snug border border-primary/30 rounded-lg p-3 bg-primary/5">
              {lastMessage}
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
