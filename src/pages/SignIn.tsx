import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { requestPasswordReset, signInWithGoogle } from "@/lib/firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleGoogle = async () => {
    if (googleLoading) return;
    setError(null);
    setInfo(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Google sign-in failed.";
      setError(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }
    try {
      await requestPasswordReset(email.trim());
      setInfo("Password reset email sent. Check your inbox.");
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e && typeof (e as { message?: unknown }).message === "string"
          ? (e as { message: string }).message
          : "Could not send reset email.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-[linear-gradient(145deg,#061731_0%,#0a2246_45%,#061731_100%)] p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,hsl(var(--primary)/0.34),transparent_34%),radial-gradient(circle_at_84%_14%,#53586b55,transparent_38%),radial-gradient(circle_at_52%_86%,hsl(var(--primary)/0.18),transparent_42%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,#06173166_55%,#061731AA_100%)]" />
      </div>
      <div className="w-full max-w-md animate-scale-in relative z-10">
        <div className="glass-card p-8 space-y-6 border-border/60 shadow-[0_20px_60px_hsl(var(--background)/0.55)]">
          {/* Logo */}
          <div className="text-center space-y-2">
            <img
              src="/2.svg"
              alt="ElyntisTec logo"
              className="h-24 w-24 object-contain mx-auto"
            />
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your ElyntisTec.com account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none focus:border-primary/50 transition-all"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm text-muted-foreground">Password</label>
                <button type="button" className="text-xs text-primary hover:underline" onClick={handleForgotPassword}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none focus:border-primary/50 transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm btn-glow hover:brightness-110 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary">
              {info}
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm font-medium text-foreground hover:bg-muted/70 transition-all disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
