"use client";

import { useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Mail,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!email.trim()) {
        setError("Email is required");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setLoading(true);
      try {
        const { error: resetError } = await resetPassword(email);
        if (resetError) {
          setError(resetError);
          return;
        }
        setSuccess(true);
      } catch {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, resetPassword],
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/3 size-[500px] rounded-full bg-violet/8 blur-[120px]" />
        <div className="absolute bottom-0 right-1/3 size-[400px] rounded-full bg-cyan/6 blur-[100px]" />
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
          {success ? (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-emerald/20">
                  <CheckCircle2 className="size-8 text-emerald-400" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Check Your Email</h1>
                <p className="text-sm text-muted-foreground">
                  We&apos;ve sent a password reset link to{" "}
                  <strong className="text-foreground">{email}</strong>
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-violet-300" />
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Didn&apos;t receive the email? Check your spam folder or try again with a different email address.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors"
              >
                Try a different email
              </button>
            </>
          ) : (
            <>
              <h1 className="mb-1 text-2xl font-bold">Forgot Password?</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                No worries, we&apos;ll send you reset instructions
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
                <div>
                  <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-violet/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet to-indigo py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-violet/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}

          <Link
            href="/signin"
            className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200"
          >
            <ArrowLeft className="size-4" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
