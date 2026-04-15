import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type OpsEnv = "Factory A" | "Factory B" | "Staging";

type OpsContextValue = {
  env: OpsEnv;
  setEnv: (env: OpsEnv) => void;
  lastSyncAt: Date | null;
  syncId: number;
  syncing: boolean;
  runSync: () => void;
  exportSnapshot: () => void;
  status: "Stable" | "Warning";
};

const OpsContext = createContext<OpsContextValue | null>(null);

const LS_ENV_KEY = "elyntis.ops.env";

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function OpsProvider({ children }: { children: ReactNode }) {
  const [env, setEnvState] = useState<OpsEnv>("Factory A");
  const [syncId, setSyncId] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [status, setStatus] = useState<"Stable" | "Warning">("Stable");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LS_ENV_KEY) as OpsEnv | null;
      if (saved === "Factory A" || saved === "Factory B" || saved === "Staging") {
        setEnvState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setEnv = (next: OpsEnv) => {
    setEnvState(next);
    try {
      window.localStorage.setItem(LS_ENV_KEY, next);
    } catch {
      // ignore
    }
    // env change should behave like a soft sync for demo data
    setSyncId((n) => n + 1);
  };

  useEffect(() => {
    const t = setInterval(() => {
      // demo status: mostly stable, more warnings in staging
      const p = env === "Staging" ? 0.55 : 0.8;
      setStatus(Math.random() < p ? "Stable" : "Warning");
    }, 8000);
    return () => clearInterval(t);
  }, [env]);

  const runSync = () => {
    if (syncing) return;
    setSyncing(true);
    const started = new Date();
    // Broadcast a sync event for any widgets that want to refresh.
    window.dispatchEvent(new CustomEvent("elyntis:sync", { detail: { env, at: started.toISOString() } }));
    setTimeout(() => {
      setSyncing(false);
      setLastSyncAt(new Date());
      setSyncId((n) => n + 1);
    }, 900);
  };

  const exportSnapshot = () => {
    const snapshot = {
      exportedAt: new Date().toISOString(),
      env,
      status,
      lastSyncAt: lastSyncAt?.toISOString() ?? null,
      syncId,
      note: "Client-side demo snapshot (no backend).",
    };
    const safeEnv = env.replace(/\s+/g, "-").toLowerCase();
    downloadJson(`elyntis-snapshot-${safeEnv}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`, snapshot);
  };

  const value = useMemo<OpsContextValue>(
    () => ({ env, setEnv, lastSyncAt, syncId, syncing, runSync, exportSnapshot, status }),
    [env, lastSyncAt, syncId, syncing, status],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used within <OpsProvider />");
  return ctx;
}

