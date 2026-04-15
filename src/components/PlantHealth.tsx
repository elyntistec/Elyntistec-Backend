import { useEffect, useMemo, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { useOps } from "@/context/OpsContext";

type Slice = { name: string; value: number; fill: string };

function makeHealth(): Slice[] {
  const healthy = 18 + Math.floor(Math.random() * 6);
  const degraded = 3 + Math.floor(Math.random() * 4);
  const stalled = Math.max(0, 2 + Math.floor(Math.random() * 3) - (Math.random() < 0.4 ? 1 : 0));
  return [
    { name: "Healthy", value: healthy, fill: "hsl(174, 72%, 46%)" },
    { name: "Degraded", value: degraded, fill: "hsl(38, 92%, 50%)" },
    { name: "Stalled", value: stalled, fill: "hsl(0, 72%, 51%)" },
  ];
}

export default function PlantHealth() {
  const { env, syncId } = useOps();
  const [slices, setSlices] = useState<Slice[]>(() => makeHealth());

  // Refresh on env change / sync to make header buttons feel "real".
  useEffect(() => {
    setSlices(makeHealth());
  }, [env, syncId]);

  const total = useMemo(() => slices.reduce((s, x) => s + x.value, 0), [slices]);
  const stalled = slices.find((s) => s.name === "Stalled")?.value ?? 0;
  const degraded = slices.find((s) => s.name === "Degraded")?.value ?? 0;

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <HeartPulse className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Plant health</h3>
            <p className="text-xs text-muted-foreground">Assets by state (demo)</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setSlices(makeHealth())}>
          Refresh
        </Button>
      </div>

      <div className="h-48 rounded-xl border border-border/40 bg-background/30 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={slices} dataKey="value" nameKey="name" innerRadius={48} outerRadius={72} paddingAngle={3} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "12px",
                color: "hsl(210, 20%, 92%)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge className="rounded-full">Total assets: {total}</Badge>
        <Badge variant="outline" className="rounded-full border-warning/50 text-warning">
          Degraded: {degraded}
        </Badge>
        <Badge variant="outline" className="rounded-full border-destructive/40 text-destructive">
          Stalled: {stalled}
        </Badge>
      </div>
    </div>
  );
}

