import { useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useOps } from "@/context/OpsContext";

type Point = {
  t: string;
  throughput: number;
  errors: number;
  latency: number;
};

function makeSeries(n = 24): Point[] {
  return Array.from({ length: n }, (_, i) => {
    const base = 1600 + Math.sin(i / 3) * 220 + (Math.random() - 0.5) * 140;
    const throughput = Math.max(500, Math.round(base));
    const errors = Math.max(0, Math.round((Math.random() * 0.6 + (i % 9 === 0 ? 1.2 : 0)) * 10) / 10);
    const latency = Math.max(12, Math.round((28 + Math.cos(i / 4) * 6 + (Math.random() - 0.5) * 4) * 10) / 10);
    return { t: `${i}:00`, throughput, errors, latency };
  });
}

export default function OpsTrends() {
  const { env, syncId } = useOps();
  const [series, setSeries] = useState<Point[]>(() => makeSeries());

  useEffect(() => {
    // Refresh series when environment changes or a sync occurs.
    setSeries(makeSeries());
  }, [env, syncId]);

  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const next = prev.slice(1);
        const i = prev.length;
        next.push(makeSeries(1)[0] ?? { t: `${i}:00`, throughput: 0, errors: 0, latency: 0 });
        return next.map((p, idx) => ({ ...p, t: `${idx}:00` }));
      });
    }, 5500);
    return () => clearInterval(id);
  }, []);

  const summary = useMemo(() => {
    const last = series[series.length - 1];
    const avgT = Math.round(series.reduce((s, p) => s + p.throughput, 0) / series.length);
    const avgL = Math.round((series.reduce((s, p) => s + p.latency, 0) / series.length) * 10) / 10;
    return { last, avgT, avgL };
  }, [series]);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Operational trends</h3>
            <p className="text-xs text-muted-foreground">
              Throughput, errors, and latency (demo, updates every ~5s)
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Avg throughput</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{summary.avgT.toLocaleString()} evt/s</p>
          <p className="text-xs text-muted-foreground mt-1">Avg latency</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{summary.avgL} ms</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-xl border border-border/40 bg-background/30 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="thrFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="t" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "12px",
                  color: "hsl(210, 20%, 92%)",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="throughput"
                name="Throughput"
                stroke="hsl(174, 72%, 46%)"
                fill="url(#thrFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-48 rounded-xl border border-border/40 bg-background/30 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="t" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(220, 18%, 10%)",
                  border: "1px solid hsl(220, 14%, 18%)",
                  borderRadius: "12px",
                  color: "hsl(210, 20%, 92%)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ color: "hsl(215, 15%, 55%)", fontSize: 11 }} />
              <Line type="monotone" dataKey="latency" name="P95 latency (ms)" stroke="hsl(200, 80%, 50%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="errors" name="Error ratio (%)" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Latest: <span className="text-foreground tabular-nums">{summary.last.throughput.toLocaleString()}</span> evt/s ·{" "}
        <span className="text-foreground tabular-nums">{summary.last.latency}</span> ms ·{" "}
        <span className="text-foreground tabular-nums">{summary.last.errors}%</span> errors
      </p>
    </div>
  );
}

