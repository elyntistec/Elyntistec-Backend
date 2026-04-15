import { useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Database, Brain, BarChart3, Plug, Activity, Server,
  LogOut, Menu, Settings, User, X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mainNav = [
  { title: "Main Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "IoT device integration and data collection system", icon: Database, path: "/data-consolidation" },
  { title: "Automated data cleaning and processing engine", icon: Brain, path: "/insights" },
  { title: "Real-time monitoring and workflow management", icon: BarChart3, path: "/dashboards" },
  { title: "Workflow automation and optimization tools", icon: Plug, path: "/integrations" },
  { title: "Analytics and performance reporting dashboard", icon: Activity, path: "/monitoring" },
  { title: "Scalable architecture for industrial data systems", icon: Server, path: "/architecture" },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const profile = useMemo(() => ({ name: "Operator", role: "Admin" }), []);

  const initials = useMemo(() => {
    const parts = profile.name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase()).join("") || "OP";
  }, [profile.name]);

  const logout = () => {
    try {
      window.localStorage.removeItem("elyntis.ops.env");
      window.localStorage.removeItem("auth.token");
      window.localStorage.removeItem("auth.user");
    } catch {
      // ignore
    }
    navigate("/signin");
  };

  const NavItem = ({ item }: { item: typeof mainNav[0] }) => {
    const active = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={() => setMobileOpen(false)}
        className={`${active ? "sidebar-item-active" : "sidebar-item"} items-start`}
      >
        <item.icon className="h-4 w-4 shrink-0 mt-0.5" />
        {!collapsed && (
          <span className="min-w-0 flex-1 text-left leading-snug break-words">
            {item.title}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-xl bg-card/80 backdrop-blur border border-border/50 text-foreground"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 bg-[hsl(var(--sidebar-background)/0.82)] backdrop-blur-xl border-r border-border/40 transition-all duration-300 flex flex-col
          ${collapsed ? "lg:w-16" : "lg:w-64"}
          w-72
          ${mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className={`px-4 py-3 border-b border-border/30 flex ${collapsed ? "lg:justify-center" : "lg:justify-start"} justify-start`}>
          <img
            src="/2.svg"
            alt="ElyntisTec logo"
            className="h-20 w-20 object-contain ml-20"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pt-1 pb-4 space-y-2">
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex sidebar-item w-full mb-1 text-xs uppercase tracking-wide"
          >
            <Menu className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Collapse</span>}
          </button>

          {!collapsed && (
            <div className="px-3 pb-1">
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                Navigation
              </p>
            </div>
          )}

          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </nav>

        {/* Profile */}
        <div className="border-t border-border/30 px-3 py-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`w-full flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 hover:bg-sidebar-accent/60 hover:border-primary/25 transition-colors px-3 py-3 ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <div className="h-10 w-10 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                  {initials}
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground truncate">{profile.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{profile.role}</p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" sideOffset={10} className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </aside>
    </>
  );
}
