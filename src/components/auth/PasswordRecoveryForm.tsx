
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PasswordRecoveryFormProps = {
  mode: "forgot" | "reset";
};

export default function PasswordRecoveryForm({
  mode,
}: PasswordRecoveryFormProps) {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isReset = mode === "reset";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isReset && password !== confirmPassword) {
      setError("Your passwords don't match. Please try again.");
      return;
    }

    if (isReset && password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isReset) {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) throw updateError;

        setSuccess("Your password has been updated successfully.");
        setPassword("");
        setConfirmPassword("");
      } else {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
          });

        if (resetError) throw resetError;

        setSuccess(
          "If an account exists for that email address, a password reset link will be sent. Please check your inbox."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5f0] px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 font-editorial text-2xl text-[#353630]"
        >
          <Sparkles size={19} className="text-[#89947a]" />
          Palette Atelier
        </Link>

        <div className="mb-9">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#89947a]">
            {isReset ? "A FRESH START" : "ACCOUNT RECOVERY"}
          </p>

          <h1 className="font-editorial text-5xl text-[#353630]">
            {isReset ? "Choose a new password." : "Forgot your password?"}
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#858479]">
            {isReset
              ? "Choose a new password for your Palette Atelier account."
              : "No worries. Enter your account email and we'll send you a link to reset your password."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isReset ? (
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#55564d]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#e5e2d9] bg-[#fffefa] px-4 py-3.5 text-sm text-[#353630] outline-none transition focus:border-[#89947a] focus:ring-2 focus:ring-[#89947a]/15"
              />
            </div>
          ) : (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#55564d]"
                >
                  New password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-[#e5e2d9] bg-[#fffefa] px-4 py-3.5 text-sm text-[#353630] outline-none transition focus:border-[#89947a] focus:ring-2 focus:ring-[#89947a]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#55564d]"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Enter your new password again"
                  className="w-full rounded-xl border border-[#e5e2d9] bg-[#fffefa] px-4 py-3.5 text-sm text-[#353630] outline-none transition focus:border-[#89947a] focus:ring-2 focus:ring-[#89947a]/15"
                />
              </div>
            </>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {success && (
            <div
              role="status"
              className="flex gap-3 rounded-xl border border-[#dce3d2] bg-[#eef1e9] px-4 py-3 text-sm leading-6 text-[#59654d]"
            >
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#89947a] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#758267] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : isReset
                ? "Update password"
                : "Send reset link"}

            {!loading && <ArrowRight size={17} />}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#758267] hover:underline"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
