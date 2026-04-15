import { useEffect, useMemo, useState } from "react";
import { Activity, Bell, Filter, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Metric = { label: string; unit: string; value: number; max: number };

const baseMetrics: Metric[] = [
  { label: "Throughput", unit: "evt/s", value: 1840, max: 3500 },
  { label: "P95 latency", unit: "ms", value: 42, max: 120 },
  { label: "Error ratio", unit: "%", value: 0.12, max: 2 },
  { label: "Cache hit", unit: "%", value: 91, max: 100 },
];

type Alert = {
  id: string;
  severity: "info" | "warning" | "critical";
  source: string;
  message: string;
  time: string;
};

const initialAlerts: Alert[] = [
  { id: "a1", severity: "warning", source: "edge-metrics", message: "Lag exceeded 15s on collector D", time: "2m ago" },
  { id: "a2", severity: "info", source: "etl", message: "Compaction completed (16 shards)", time: "9m ago" },
  { id: "a3", severity: "critical", source: "plc-tags", message: "Stream stalled: gateway C offline", time: "18m ago" },
];

export default function Monitoring() {
  const [metrics, setMetrics] = useState(baseMetrics);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState<"all" | Alert["severity"]>("all");

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.label === "Throughput") {
            const jitter = (Math.random() - 0.5) * 80;
            return {
              ...m,
              value: Math.max(200, Math.min(m.max, Math.round(m.value + jitter))),
            };
          }
          if (m.label === "P95 latency") {
            const jitter = (Math.random() - 0.5) * 6;
            return { ...m, value: Math.max(10, Math.round((m.value + jitter) * 10) / 10) };
          }
          if (m.label === "Error ratio") {
            const jitter = (Math.random() - 0.5) * 0.04;
            return { ...m, value: Math.max(0, Math.round((m.value + jitter) * 100) / 100) };
          }
          const jitter = (Math.random() - 0.5) * 2;
          return { ...m, value: Math.max(50, Math.min(100, Math.round(m.value + jitter))) };
        }),
      );
    }, 1200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date();
      const hhmm = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const candidates: Omit<Alert, "id" | "time">[] = [
        { severity: "info", source: "monitor", message: "Heartbeat OK (all services)" },
        { severity: "warning", source: "cache", message: "Hit rate dipped below 88%" },
        { severity: "warning", source: "ingest", message: "Burst detected: throughput spike" },
        { severity: "critical", source: "api", message: "Error ratio trending high (check upstream)" },
      ];
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      const tail = Math.random() < 0.55 ? { time: `${hhmm}` } : { time: `${Math.floor(Math.random() * 20) + 1}m ago` };
      setAlerts((prev) => [
        { id: `a${Math.floor(Math.random() * 9000) + 1000}`, ...pick, ...tail },
        ...prev,
      ].slice(0, 12));
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const filteredAlerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts.filter((a) => {
      if (severity !== "all" && a.severity !== severity) return false;
      if (!q) return true;
      return (a.source + " " + a.message).toLowerCase().includes(q);
    });
  }, [alerts, query, severity]);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  return (
    <DashboardLayout
      title="Analytics & performance"
      subtitle="Live-updating demo metrics for shifts and SLO reviews"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Alert feed</h2>
              <Badge
                variant={criticalCount ? "destructive" : "secondary"}
                className="rounded-full ml-1"
              >
                {criticalCount ? `${criticalCount} critical` : "stable"}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[240px]">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter alerts…"
                  className="rounded-xl pr-10"
                />
                <Filter className="h-4 w-4 text-muted-foreground absolute right-3 top-3" />
              </div>
              <div className="flex gap-2">
                {(["all", "info", "warning", "critical"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={severity === s ? "secondary" : "outline"}
                    className="rounded-xl"
                    onClick={() => setSeverity(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/40 bg-background/40 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="w-24">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground">
                      No alerts match your filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAlerts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <Badge
                          variant={a.severity === "critical" ? "destructive" : a.severity === "warning" ? "secondary" : "outline"}
                          className="rounded-full"
                        >
                          {a.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{a.source}</TableCell>
                      <TableCell className="text-foreground">{a.message}</TableCell>
                      <TableCell className="text-muted-foreground tabular-nums">{a.time}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            New demo alerts append every ~7s. Use filters to simulate on-call triage.
          </p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Quick summary</h3>
          <div className="grid gap-3">
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Alerts (last 12)</p>
              <p className="text-2xl font-semibold tabular-nums text-foreground">{alerts.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {alerts.filter((a) => a.severity === "warning").length} warning · {criticalCount} critical
              </p>
            </div>
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <p className="text-xs text-muted-foreground">Focus</p>
              <p className="text-sm text-foreground mt-1 leading-snug">
                Prioritize streams with high lag and rising error ratio during bursts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => {
          const barPct =
            m.label === "P95 latency" || m.label === "Error ratio"
              ? Math.min(100, (m.value / m.max) * 100)
              : Math.min(100, (m.value / m.max) * 100);
          return (
            <div key={m.label} className="glass-card p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-2xl font-semibold tabular-nums text-foreground mt-1">
                    {m.label === "Throughput"
                      ? m.value.toLocaleString()
                      : m.label === "Error ratio"
                        ? m.value.toFixed(2)
                        : m.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{m.unit}</span>
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  {m.label === "Throughput" ? (
                    <TrendingUp className="h-4 w-4 text-primary" />
                  ) : (
                    <Activity className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Signal mix (relative)</h2>
        <div className="flex h-36 items-end gap-2">
          {metrics.map((m) => {
            const h = Math.max(8, Math.min(100, (m.value / m.max) * 100));
            return (
              <div key={m.label + "-bar"} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full max-w-[48px] rounded-t-lg bg-primary/80 transition-all duration-500"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground text-center leading-tight px-0.5">
                  {m.label.split(" ")[0]}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Values jitter every ~1.2s to mimic live telemetry (client-side only).
        </p>
      </div>
    </DashboardLayout>
  );
}
