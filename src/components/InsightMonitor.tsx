import { Activity, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const data = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  value: Math.floor(40 + Math.random() * 60),
  predict: Math.floor(50 + Math.random() * 40),
}));

export default function InsightMonitor() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-success/10">
            <Activity className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Insight Monitoring</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="glow-dot" />
              <span>Live</span>
              <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: "3s" }} />
              <span>Auto-refresh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174, 72%, 46%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }} axisLine={false} tickLine={false} />
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
            <Area type="monotone" dataKey="value" stroke="hsl(174, 72%, 46%)" fill="url(#colorValue)" strokeWidth={2} />
            <Area type="monotone" dataKey="predict" stroke="hsl(200, 80%, 50%)" fill="url(#colorPredict)" strokeWidth={1.5} strokeDasharray="5 5" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
