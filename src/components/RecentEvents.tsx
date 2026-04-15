import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList } from "lucide-react";
import { useOps } from "@/context/OpsContext";

type EventRow = {
  id: string;
  type: "ingest" | "alert" | "job" | "change";
  status: "ok" | "warn" | "fail";
  detail: string;
  time: string;
};

function makeRows(): EventRow[] {
  const now = new Date();
  const fmt = (minsAgo: number) => {
    const d = new Date(now.getTime() - minsAgo * 60_000);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const templates: Omit<EventRow, "id" | "time">[] = [
    { type: "ingest", status: "ok", detail: "Collector D flushed 12 shards" },
    { type: "job", status: "ok", detail: "Cleaning pipeline committed batch" },
    { type: "alert", status: "warn", detail: "Lag spike on edge-metrics" },
    { type: "change", status: "ok", detail: "Rule enabled: Shift handoff digest" },
    { type: "alert", status: "fail", detail: "Stream stalled: PLC gateway C" },
  ];
  return Array.from({ length: 8 }, (_, i) => {
    const base = templates[Math.floor(Math.random() * templates.length)]!;
    const minsAgo = 2 + i * (2 + Math.floor(Math.random() * 3));
    return {
      id: `e${Math.floor(Math.random() * 9000) + 1000}`,
      ...base,
      time: fmt(minsAgo),
    };
  });
}

export default function RecentEvents() {
  const { env, syncId } = useOps();
  const [rows, setRows] = useState<EventRow[]>(() => makeRows());

  useEffect(() => {
    setRows(makeRows());
  }, [env, syncId]);

  const counts = useMemo(() => {
    const ok = rows.filter((r) => r.status === "ok").length;
    const warn = rows.filter((r) => r.status === "warn").length;
    const fail = rows.filter((r) => r.status === "fail").length;
    return { ok, warn, fail };
  }, [rows]);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recent activity</h3>
            <p className="text-xs text-muted-foreground">Operational events across ingest, jobs, and alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="rounded-full">ok: {counts.ok}</Badge>
          <Badge variant="outline" className="rounded-full border-warning/50 text-warning">
            warn: {counts.warn}
          </Badge>
          <Badge variant="outline" className="rounded-full border-destructive/40 text-destructive">
            fail: {counts.fail}
          </Badge>
          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setRows(makeRows())}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-background/40 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead className="w-24">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-muted-foreground">{r.type}</TableCell>
                <TableCell>
                  <Badge
                    variant={r.status === "ok" ? "default" : r.status === "warn" ? "secondary" : "destructive"}
                    className="rounded-full"
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground">{r.detail}</TableCell>
                <TableCell className="text-muted-foreground tabular-nums">{r.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

