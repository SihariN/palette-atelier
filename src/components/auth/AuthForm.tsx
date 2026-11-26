
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "register";
  nextPath: string;
};

export default function AuthForm({ mode, nextPath }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isRegister && password !== confirmPassword) {
      setError("Your passwords don't match. Please try again.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(nextPath)}`,
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          router.replace(nextPath);
          router.refresh();
        } else {
          setMessage(
            "Your account has been created! Please check your email for a confirmation link before signing in."
          );
        }
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;

        router.replace(nextPath);
        router.refresh();
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
    <main className="min-h-screen bg-[#f7f5f0] lg:grid lg:grid-cols-2">
      {/* Editorial panel */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#e9ece2] p-12 lg:flex xl:p-16">
        <div className="studio-grid absolute inset-0 opacity-40" />

        <Link href="/" className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#89947a] text-white">
            <Sparkles size={19} />
          </div>
          <span className="font-serif text-2xl text-[#353630]">
            Palette Atelier
          </span>
        </Link>

        <div className="relative z-10 max-w-lg">
          <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-[#89947a]">
            YOUR LITTLE CREATIVE SPACE
          </p>

          <h1 className="font-editorial text-6xl leading-[1.08] text-[#353630] xl:text-7xl">
            {isRegister ? (
              <>
                Every idea
                <br />
                begins with
                <br />
                <span className="italic text-[#89947a]">a little color.</span>
              </>
            ) : (
              <>
                Welcome back
                <br />
                to your
                <br />
                <span className="italic text-[#89947a]">creative space.</span>
              </>
            )}
          </h1>

          <p className="mt-7 max-w-sm text-sm leading-7 text-[#77786d]">
            {isRegister
              ? "Create your own little corner of creativity. Save your palettes, explore ideas and bring your designs to life."
              : "Your palettes, projects and creative ideas are waiting for you. Pick up right where you left off."}
          </p>

          <div className="mt-12 flex items-center gap-3">
            {["#89947a", "#d5aaa3", "#c5b8d7", "#ebc8a9", "#d8d1bd"].map(
              (color) => (
                <div
                  key={color}
                  className="h-12 w-12 rounded-full shadow-sm"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>

        <p className="relative z-10 text-xs tracking-wide text-[#929386]">
          A space to explore, experiment and create.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="w-full max-w-md"
        >
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 font-editorial text-2xl text-[#353630] lg:hidden"
          >
            <Sparkles size={19} className="text-[#89947a]" />
            Palette Atelier
          </Link>

          <div className="mb-9">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#89947a]">
              {isRegister ? "A NEW BEGINNING" : "YOUR CREATIVE SPACE"}
            </p>

            <h2 className="font-editorial text-5xl text-[#353630]">
              {isRegister ? "Create an account" : "Welcome back."}
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#858479]">
              {isRegister
                ? "Let's get your creative journey started."
                : "Sign in to continue creating beautiful things."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#55564d]"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-[#e5e2d9] bg-[#fffefa] px-4 py-3.5 pr-12 text-sm text-[#353630] outline-none transition focus:border-[#89947a] focus:ring-2 focus:ring-[#89947a]/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#99998d] transition hover:text-[#55564d]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {!isRegister && (
            <div className="-mt-2 text-right">
                <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#758267] hover:underline"
                >
                Forgot password?
                </Link>
            </div>
            )}

            {isRegister && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-[#55564d]"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your password again"
                  className="w-full rounded-xl border border-[#e5e2d9] bg-[#fffefa] px-4 py-3.5 text-sm text-[#353630] outline-none transition focus:border-[#89947a] focus:ring-2 focus:ring-[#89947a]/15"
                />
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="rounded-xl border border-[#dce3d2] bg-[#eef1e9] px-4 py-3 text-sm leading-6 text-[#59654d]"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#89947a] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-[#758267] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create my account"
                  : "Sign in"}

              {!loading && <ArrowRight size={17} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-[#858479]">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#758267] hover:underline"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Palette Atelier?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#758267] hover:underline"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>

          <p className="mt-12 text-center text-xs leading-5 text-[#aaa99e]">
            By continuing, you agree to use Palette Atelier responsibly
            and keep your account details secure.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
