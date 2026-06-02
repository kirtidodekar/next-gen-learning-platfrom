"use client";

import { useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// ── Validation helpers ────────────────────────────────────────
function validateName(name: string): string | null {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
}

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address";
  return null;
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push("At least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
  if (!/\d/.test(password)) errors.push("One number");
  return errors;
}

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signIn } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);

  // Password strength indicators
  const passwordErrors = validatePassword(password);
  const passwordValid = passwordErrors.length === 0;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      // Validate all fields
      const nameError = validateName(fullName);
      if (nameError) { setError(nameError); return; }

      const emailError = validateEmail(email);
      if (emailError) { setError(emailError); return; }

      if (!passwordValid) {
        setError("Password does not meet requirements");
        return;
      }

      if (!passwordsMatch) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);
      try {
        const { error: authError } = await signUp(email, password, fullName.trim());
        if (authError) {
          const msg = authError.toLowerCase();
          if (msg.includes("already registered") || msg.includes("already been registered")) {
            setError("This email is already registered. Please sign in instead.");
          } else if (msg.includes("weak password") || msg.includes("password")) {
            setError("Password is too weak. Please use a stronger password.");
          } else {
            setError(authError);
          }
          return;
        }

        // Try to auto-sign-in immediately
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          // Email confirmation required - show verification message
          setNeedsEmailVerification(true);
          setSuccess(true);
          setTimeout(() => router.push("/signin"), 4000);
        } else {
          // Auto-sign-in succeeded - go to dashboard
          setSuccess(true);
          setTimeout(() => router.push("/dashboard"), 1500);
        }
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [fullName, email, password, passwordValid, passwordsMatch, signUp, router],
  );

  if (success) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
        >
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-emerald/20">
            <CheckCircle2 className="size-8 text-emerald-400" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">Account Created!</h2>
          {needsEmailVerification ? (
            <p className="mb-6 text-muted-foreground">
              We&apos;ve sent a verification email to <strong className="text-foreground">{email}</strong>.
              Please check your inbox and verify your email, then sign in.
            </p>
          ) : (
            <p className="mb-6 text-muted-foreground">
              Welcome, <strong className="text-foreground">{fullName}</strong>! Redirecting you to your dashboard...
            </p>
          )}
          {needsEmailVerification ? (
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-indigo px-6 py-2.5 text-sm font-semibold text-white"
            >
              Go to Sign In
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-indigo px-6 py-2.5 text-sm font-semibold text-white"
            >
              Go to Dashboard
              <ArrowRight className="size-4" />
            </Link>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 size-[500px] rounded-full bg-violet/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 size-[400px] rounded-full bg-cyan/6 blur-[100px]" />
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
          <h1 className="mb-1 text-2xl font-bold">Create your account</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Start your learning journey today
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
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
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

              {/* Password requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number"].map(
                    (req) => {
                      const met = !passwordErrors.includes(
                        req === "At least 8 characters"
                          ? "At least 8 characters"
                          : req === "One uppercase letter"
                            ? "One uppercase letter"
                            : req === "One lowercase letter"
                              ? "One lowercase letter"
                              : "One number",
                      );
                      return (
                        <div
                          key={req}
                          className={`flex items-center gap-1.5 text-xs ${met ? "text-emerald-400" : "text-muted-foreground"}`}
                        >
                          <CheckCircle2 className="size-3" />
                          {req}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`mt-1 text-xs ${passwordsMatch ? "text-emerald-400" : "text-destructive"}`}>
                  {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                </p>
              )}
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
                  Create Account
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-violet-300 hover:text-violet-200">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
