import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createAccountWithEmail } from "@/lib/firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });
  const passRules = {
    minLen: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /\d/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };
  const passValid = Object.values(passRules).every(Boolean);
  const mismatch = form.password && form.confirm && form.password !== form.confirm;

  const mapFirebaseError = (code?: string) => {
    switch (code) {
      case "auth/operation-not-allowed":
        return "Email/Password sign-up is disabled in Firebase. Enable it in Firebase Console -> Authentication -> Sign-in method.";
      case "auth/email-already-in-use":
        return "This email is already registered. Try Sign in instead.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      case "auth/weak-password":
        return "Password is too weak. Use at least 8 characters with mixed types.";
      case "auth/network-request-failed":
        return "Network error. Check your connection and try again.";
      default:
        return "Account creation failed. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch || !passValid) return;
    setError(null);
    setLoading(true);
    try {
      await createAccountWithEmail({ name: form.name, email: form.email, password: form.password });
      navigate("/");
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e && typeof (e as { code?: unknown }).code === "string"
          ? (e as { code: string }).code
          : undefined;
      const message = mapFirebaseError(code);
      setError(message);
    } finally {
      setLoading(false);
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
          <div className="text-center space-y-2">
            <img
              src="/2.svg"
              alt="ElyntisTec logo"
              className="h-24 w-24 object-contain mx-auto"
            />
            <h2 className="text-2xl font-bold text-foreground">Create account</h2>
            <p className="text-sm text-muted-foreground">Start your AI-powered journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none focus:border-primary/50 transition-all" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none focus:border-primary/50 transition-all" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none focus:border-primary/50 transition-all" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] pt-1">
                <p className={passRules.minLen ? "text-primary" : "text-muted-foreground"}>At least 8 characters</p>
                <p className={passRules.upper ? "text-primary" : "text-muted-foreground"}>One uppercase letter</p>
                <p className={passRules.lower ? "text-primary" : "text-muted-foreground"}>One lowercase letter</p>
                <p className={passRules.number ? "text-primary" : "text-muted-foreground"}>One number</p>
                <p className={passRules.special ? "text-primary" : "text-muted-foreground"}>One special symbol</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPass ? "text" : "password"} value={form.confirm} onChange={(e) => update("confirm", e.target.value)} placeholder="••••••••" className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/40 border text-sm text-foreground placeholder:text-muted-foreground input-glow focus:outline-none transition-all ${mismatch ? "border-destructive" : "border-border/40 focus:border-primary/50"}`} required />
              </div>
              {mismatch && <p className="text-xs text-destructive">Passwords don't match</p>}
            </div>
            <button type="submit" disabled={loading || !!mismatch || !passValid} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm btn-glow hover:brightness-110 transition-all disabled:opacity-60">
              {loading ? <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" /> : "Create Account"}
            </button>
          </form>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
