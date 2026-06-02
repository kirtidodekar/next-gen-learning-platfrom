"use client";

import { useState, useCallback, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!password) {
        setError("Password is required");
        return;
      }

      setLoading(true);
      try {
        const { error: authError } = await signIn(email, password);
        if (authError) {
          // Log the raw error for debugging
          console.warn("[SignIn] Supabase auth error:", authError);
          const msg = authError.toLowerCase();
          if (msg.includes("invalid login credentials") || msg.includes("invalid_credentials")) {
            setError(
              "Invalid email or password. If you signed up before disabling email confirmation, delete your old account in Supabase Dashboard → Authentication → Users, then sign up again."
            );
          } else if (msg.includes("email not confirmed")) {
            setError(
              "Your email is not confirmed. Go to Supabase Dashboard → Authentication → Providers → Email and turn OFF 'Confirm email', then sign up again with a new account."
            );
          } else if (msg.includes("too many requests")) {
            setError("Too many login attempts. Please wait a moment and try again.");
          } else {
            setError(authError);
          }
          return;
        }
        // Auth state change will trigger redirect via useEffect
      } catch (err) {
        console.error("[SignIn] Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, signIn],
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 right-1/4 size-[500px] rounded-full bg-violet/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 size-[400px] rounded-full bg-cyan/6 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet to-indigo">
            <Sparkles className="size-5 text-white" />
          </div>
          <span className="text-xl font-bold">NextGen Learn</span>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="mb-1 text-2xl font-bold">Welcome back</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to continue your learning journey
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="signin-email" className="mb-1.5 block text-sm font-medium">
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signin-password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-violet focus:ring-violet/20"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-violet-300 hover:text-violet-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-indigo py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet/25 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-violet-300 hover:text-violet-200">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
