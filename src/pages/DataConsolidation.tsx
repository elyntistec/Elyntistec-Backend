import { useCallback, useMemo, useState } from "react";
import { Cpu, Plus, RefreshCw, Radio, Wifi } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Device = {
  id: string;
  name: string;
  type: string;
  online: boolean;
  lastReading: string;
};

type Stream = {
  id: string;
  deviceId: string;
  stream: string;
  rate: number; // points/min
  lagSec: number;
  status: "healthy" | "degraded" | "stalled";
};

const initialDevices: Device[] = [
  { id: "d1", name: "Line sensor array A", type: "Modbus TCP", online: true, lastReading: "24.3 °C" },
  { id: "d2", name: "Vibration pack B", type: "MQTT", online: true, lastReading: "1.02 g RMS" },
  { id: "d3", name: "PLC gateway C", type: "OPC UA", online: false, lastReading: "—" },
  { id: "d4", name: "Edge collector D", type: "HTTP", online: true, lastReading: "1.2k points/min" },
];

const initialStreams: Stream[] = [
  { id: "s1", deviceId: "d1", stream: "temperature", rate: 360, lagSec: 2, status: "healthy" },
  { id: "s2", deviceId: "d2", stream: "vibration", rate: 840, lagSec: 4, status: "healthy" },
  { id: "s3", deviceId: "d4", stream: "edge-metrics", rate: 1200, lagSec: 11, status: "degraded" },
  { id: "s4", deviceId: "d3", stream: "plc-tags", rate: 0, lagSec: 0, status: "stalled" },
];

export default function DataConsolidation() {
  const [devices, setDevices] = useState(initialDevices);
  const [streams, setStreams] = useState(initialStreams);
  const [collecting, setCollecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pointsIngested, setPointsIngested] = useState(128_400);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("MQTT");
  const [newEndpoint, setNewEndpoint] = useState("");

  const toggleDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, online: !d.online } : d)),
    );
    setStreams((prev) =>
      prev.map((s) =>
        s.deviceId === id
          ? {
              ...s,
              status: s.status === "stalled" ? "healthy" : s.status,
              rate: s.rate === 0 ? 600 : s.rate,
              lagSec: Math.max(1, Math.round(s.lagSec || 2)),
            }
          : s,
      ),
    );
  };

  const runCollection = useCallback(() => {
    if (collecting) return;
    setCollecting(true);
    setProgress(0);
    const online = devices.filter((d) => d.online).length;
    let step = 0;
    const tick = setInterval(() => {
      step += 1;
      setProgress((p) => Math.min(100, p + 12));
      if (step >= 9) {
        clearInterval(tick);
        setCollecting(false);
        setProgress(100);
        setPointsIngested((n) => n + online * 2_400 + Math.floor(Math.random() * 800));
        setLastRun(new Date().toLocaleTimeString());
        setDevices((prev) =>
          prev.map((d) =>
            d.online
              ? {
                  ...d,
                  lastReading:
                    d.type === "MQTT"
                      ? `${(0.9 + Math.random() * 0.2).toFixed(2)} g RMS`
                      : d.type === "Modbus TCP"
                        ? `${22 + Math.random() * 6} °C`
                        : d.lastReading,
                }
              : d,
          ),
        );
        setStreams((prev) =>
          prev.map((s) => {
            const dev = devices.find((d) => d.id === s.deviceId);
            if (!dev?.online) return { ...s, status: "stalled", rate: 0, lagSec: 0 };
            const lag = Math.max(1, Math.round(s.lagSec + (Math.random() - 0.5) * 6));
            const rate = Math.max(80, Math.round(s.rate + (Math.random() - 0.5) * 140));
            const status: Stream["status"] = lag > 18 ? "degraded" : "healthy";
            return { ...s, lagSec: lag, rate, status };
          }),
        );
      }
    }, 160);
  }, [collecting, devices]);

  const ingestSummary = useMemo(() => {
    const online = devices.filter((d) => d.online).length;
    const healthy = streams.filter((s) => s.status === "healthy").length;
    const degraded = streams.filter((s) => s.status === "degraded").length;
    const stalled = streams.filter((s) => s.status === "stalled").length;
    const totalRate = streams.reduce((sum, s) => sum + s.rate, 0);
    return { online, healthy, degraded, stalled, totalRate };
  }, [devices, streams]);

  const addDevice = () => {
    const name = newName.trim();
    if (!name) return;
    const id = `d${Math.floor(Math.random() * 9000) + 1000}`;
    setDevices((prev) => [
      ...prev,
      { id, name, type: newType, online: true, lastReading: "—" },
    ]);
    setStreams((prev) => [
      ...prev,
      {
        id: `s${Math.floor(Math.random() * 9000) + 1000}`,
        deviceId: id,
        stream: "telemetry",
        rate: 420,
        lagSec: 3,
        status: "healthy",
      },
    ]);
    setNewName("");
    setNewEndpoint("");
  };

  return (
    <DashboardLayout
      title="IoT device integration & collection"
      subtitle="Connect industrial devices, ingest telemetry, and consolidate streams"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Radio className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Registered devices</h2>
              <p className="text-xs text-muted-foreground">
                Toggle connectivity to simulate drops. Pull applies to online devices only.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
              Enroll new device (demo)
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Device name"
                className="rounded-xl"
              />
              <Input
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Protocol (e.g., MQTT)"
                className="rounded-xl"
              />
              <Input
                value={newEndpoint}
                onChange={(e) => setNewEndpoint(e.target.value)}
                placeholder="Endpoint / topic (optional)"
                className="rounded-xl"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Tip: the endpoint is stored only in UI state (no backend yet).
              </p>
              <Button className="rounded-xl" onClick={addDevice} disabled={!newName.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add device
              </Button>
            </div>
          </div>

          <ul className="divide-y divide-border/40 rounded-xl border border-border/40 overflow-hidden">
            {devices.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3 bg-card/40">
                <Cpu className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-[140px]">
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.type}</p>
                </div>
                <div className="text-xs text-muted-foreground w-28">{d.lastReading}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => toggleDevice(d.id)}
                >
                  {d.online ? "Online" : "Offline"}
                </Button>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Stream health</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="rounded-full">
                  Online devices: {ingestSummary.online}
                </Badge>
                <Badge className="rounded-full">Healthy: {ingestSummary.healthy}</Badge>
                <Badge variant="outline" className="rounded-full border-warning/50 text-warning">
                  Degraded: {ingestSummary.degraded}
                </Badge>
                <Badge variant="outline" className="rounded-full border-destructive/40 text-destructive">
                  Stalled: {ingestSummary.stalled}
                </Badge>
              </div>
            </div>
            <div className="rounded-xl border border-border/40 bg-background/40 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stream</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Lag</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {streams.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-foreground">
                        {devices.find((d) => d.id === s.deviceId)?.name ?? s.deviceId}
                        <span className="text-muted-foreground font-normal"> / {s.stream}</span>
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{s.rate.toLocaleString()} / min</TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">{s.lagSec}s</TableCell>
                      <TableCell>
                        <Badge
                          variant={s.status === "healthy" ? "default" : s.status === "degraded" ? "secondary" : "destructive"}
                          className="rounded-full"
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">
              Aggregate rate: <span className="text-foreground tabular-nums">{ingestSummary.totalRate.toLocaleString()}</span> points/min
            </p>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Wifi className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Ingestion</h2>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Points stored (demo)</p>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {pointsIngested.toLocaleString()}
            </p>
          </div>
          {collecting && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-primary animate-pulse">Collecting batches from online devices…</p>
            </div>
          )}
          {lastRun && !collecting && (
            <p className="text-xs text-muted-foreground">Last successful run: {lastRun}</p>
          )}
          <Button
            className="w-full rounded-xl btn-glow"
            onClick={runCollection}
            disabled={collecting || devices.every((d) => !d.online)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${collecting ? "animate-spin" : ""}`} />
            Run collection cycle
          </Button>
          {devices.every((d) => !d.online) && (
            <p className="text-xs text-warning">Enable at least one device to run ingestion.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
