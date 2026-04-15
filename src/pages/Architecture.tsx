import { useMemo, useState } from "react";
import { Database, Layers, Server, ShieldCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function Architecture() {
  const [nodes, setNodes] = useState([6]);
  const [partitions, setPartitions] = useState([24]);
  const [replication, setReplication] = useState([2]);

  const headroom = useMemo(() => {
    const n = nodes[0];
    const p = partitions[0];
    const r = replication[0];
    const ingest = Math.round(n * 4200 + p * 180);
    const capacity = Math.round(n * 5100 + p * 220);
    const storageCost = Math.round((p * 18 * r + n * 22) * 10) / 10; // TB (demo)
    return {
      ingest,
      capacity,
      pct: Math.min(100, Math.round((ingest / capacity) * 100)),
      storageCost,
      resiliency: r >= 3 ? "high" : r === 2 ? "standard" : "low",
    };
  }, [nodes, partitions, replication]);

  return (
    <DashboardLayout
      title="Scalable industrial data architecture"
      subtitle="Model ingest capacity vs. compute nodes and stream partitions (demo)"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Server className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Scale controls</h2>
              <p className="text-xs text-muted-foreground">
                Adjust sliders; projected throughput updates instantly.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Ingest nodes</Label>
              <span className="text-sm tabular-nums text-foreground">{nodes[0]}</span>
            </div>
            <Slider
              min={2}
              max={16}
              step={1}
              value={nodes}
              onValueChange={setNodes}
              className="py-1"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Stream partitions</Label>
              <span className="text-sm tabular-nums text-foreground">{partitions[0]}</span>
            </div>
            <Slider
              min={6}
              max={48}
              step={2}
              value={partitions}
              onValueChange={setPartitions}
              className="py-1"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Replication factor</Label>
              <span className="text-sm tabular-nums text-foreground">{replication[0]}×</span>
            </div>
            <Slider
              min={1}
              max={4}
              step={1}
              value={replication}
              onValueChange={setReplication}
              className="py-1"
            />
            <p className="text-xs text-muted-foreground">
              Higher replication improves durability but increases storage cost.
            </p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Projected capacity</h3>
            <Badge
              variant={headroom.resiliency === "high" ? "default" : headroom.resiliency === "standard" ? "secondary" : "destructive"}
              className="rounded-full ml-2"
            >
              resiliency: {headroom.resiliency}
            </Badge>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <dt className="text-xs text-muted-foreground">Target ingest</dt>
              <dd className="text-xl font-semibold tabular-nums text-foreground mt-1">
                {headroom.ingest.toLocaleString()} <span className="text-sm font-normal">rows/s</span>
              </dd>
            </div>
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <dt className="text-xs text-muted-foreground">Rated capacity</dt>
              <dd className="text-xl font-semibold tabular-nums text-primary mt-1">
                {headroom.capacity.toLocaleString()} <span className="text-sm font-normal">rows/s</span>
              </dd>
            </div>
          </dl>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <dt className="text-xs text-muted-foreground flex items-center gap-2">
                <Database className="h-4 w-4" />
                Storage footprint (demo)
              </dt>
              <dd className="text-xl font-semibold tabular-nums text-foreground mt-1">
                {headroom.storageCost.toLocaleString()} <span className="text-sm font-normal">TB</span>
              </dd>
            </div>
            <div className="rounded-xl border border-border/40 p-4 bg-muted/20">
              <dt className="text-xs text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Durability
              </dt>
              <dd className="text-sm font-medium text-foreground mt-2 leading-snug">
                {replication[0] >= 3 ? "Multi-zone tolerant" : replication[0] === 2 ? "Zone tolerant" : "Single copy"}
              </dd>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Utilization (demo)</span>
              <span className="text-foreground tabular-nums">{headroom.pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  headroom.pct > 88 ? "bg-warning" : "bg-gradient-to-r from-primary to-accent"
                }`}
                style={{ width: `${headroom.pct}%` }}
              />
            </div>
            {headroom.pct > 88 && (
              <p className="text-xs text-warning mt-2">Approaching saturation — add nodes or partitions.</p>
            )}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Topology (simplified)</h4>
            <div className="rounded-xl border border-border/40 bg-background/40 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border/40 p-3 bg-card/40">
                  <p className="text-xs text-muted-foreground">Edge</p>
                  <p className="text-sm font-medium text-foreground">Collectors</p>
                  <p className="text-xs text-muted-foreground mt-1">Nodes: {nodes[0]}</p>
                </div>
                <div className="rounded-lg border border-border/40 p-3 bg-card/40">
                  <p className="text-xs text-muted-foreground">Stream bus</p>
                  <p className="text-sm font-medium text-foreground">Partitions</p>
                  <p className="text-xs text-muted-foreground mt-1">Count: {partitions[0]}</p>
                </div>
                <div className="rounded-lg border border-border/40 p-3 bg-card/40">
                  <p className="text-xs text-muted-foreground">Lakehouse</p>
                  <p className="text-sm font-medium text-foreground">Storage</p>
                  <p className="text-xs text-muted-foreground mt-1">Replicas: {replication[0]}×</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                This is a visual placeholder until a real infra diagram is connected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
