import { useState } from "react";
import { CheckCircle2, Circle, GitBranch, Play } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";

type StepId = "ingest" | "validate" | "escalate" | "report";

type Step = { id: StepId; label: string; detail: string; done: boolean };

const initialSteps: Step[] = [
  { id: "ingest", label: "Ingest", detail: "Buffers flushed to lake", done: true },
  { id: "validate", label: "Validate", detail: "Ruleset v12 applied", done: true },
  { id: "escalate", label: "Escalate", detail: "Open incidents to on-call", done: false },
  { id: "report", label: "Report", detail: "Shift summary PDF", done: false },
];

export default function Dashboards() {
  const [steps, setSteps] = useState(initialSteps);
  const [slas, setSlas] = useState({ ack: 94, resolve: 87 });

  const firstOpen = steps.find((s) => !s.done);

  const completeNext = () => {
    if (!firstOpen) return;
    setSteps((s) =>
      s.map((step) => (step.id === firstOpen.id ? { ...step, done: true } : step)),
    );
    setSlas((prev) => ({
      ack: Math.min(99, prev.ack + Math.floor(Math.random() * 3)),
      resolve: Math.min(99, prev.resolve + Math.floor(Math.random() * 2)),
    }));
  };

  const resetFlow = () => setSteps(initialSteps);

  return (
    <DashboardLayout
      title="Real-time monitoring & workflows"
      subtitle="Track operational steps, SLAs, and handoffs in one place"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Shift workflow</h2>
              <p className="text-xs text-muted-foreground">
                Complete the next open step. State is kept in the browser for this session.
              </p>
            </div>
          </div>
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li
                key={step.id}
                className={`flex gap-4 rounded-xl border p-4 ${
                  step.done ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card/40"
                }`}
              >
                <div className="pt-0.5">
                  {step.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-xl btn-glow" onClick={completeNext} disabled={!firstOpen}>
              <Play className="h-4 w-4 mr-2" />
              {firstOpen ? `Complete: ${firstOpen.label}` : "All steps done"}
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={resetFlow}>
              Reset workflow
            </Button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">SLA snapshot</h3>
          {[
            { label: "Ack within 15m", value: slas.ack },
            { label: "Resolve P1", value: slas.resolve },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{row.label}</span>
                <span className="text-foreground tabular-nums">{row.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${row.value}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-muted-foreground pt-2">
            Percentages tick up as you complete workflow steps (demo).
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
