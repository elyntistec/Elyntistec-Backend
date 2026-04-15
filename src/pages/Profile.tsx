import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Shield, User, LogOut } from "lucide-react";

type StoredUser = {
  uid?: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
};

export default function Profile() {
  const navigate = useNavigate();

  const user = useMemo<StoredUser>(() => {
    try {
      const raw = window.localStorage.getItem("auth.user");
      return raw ? (JSON.parse(raw) as StoredUser) : {};
    } catch {
      return {};
    }
  }, []);

  const env = useMemo(() => {
    try {
      return window.localStorage.getItem("elyntis.ops.env") || "Factory A";
    } catch {
      return "Factory A";
    }
  }, []);

  const name = user.displayName || "Operator";
  const email = user.email || "Not connected";
  const initials = (name || "OP")
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join("");

  const logout = () => {
    try {
      window.localStorage.removeItem("auth.token");
      window.localStorage.removeItem("auth.user");
      window.localStorage.removeItem("elyntis.ops.env");
    } catch {
      // ignore
    }
    navigate("/signin");
  };

  return (
    <DashboardLayout title="Profile" subtitle="Account and operator details">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card p-6 space-y-5 lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-foreground truncate">{name}</h2>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge className="rounded-full">Operator Admin</Badge>
                <Badge variant="secondary" className="rounded-full">{env}</Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">User ID</p>
              <p className="text-sm text-foreground break-all">{user.uid || "N/A"}</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-1">
              <p className="text-xs text-muted-foreground">Authentication</p>
              <p className="text-sm text-foreground">Firebase Authentication</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Account actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl" onClick={() => navigate("/settings")}>
                <Shield className="h-4 w-4 mr-2" />
                Open Settings
              </Button>
              <Button variant="secondary" className="rounded-xl" onClick={() => navigate("/signin")}>
                <Mail className="h-4 w-4 mr-2" />
                Switch Account
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Session</h3>
          <div className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <User className="h-4 w-4 text-primary" />
              Signed in
            </div>
            <p className="text-xs text-muted-foreground">
              Your local session token is stored in this browser.
            </p>
          </div>
          <Button variant="destructive" className="w-full rounded-xl" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}

