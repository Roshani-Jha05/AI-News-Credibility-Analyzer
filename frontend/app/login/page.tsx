'use client';

// ============================================================
// app/login/page.tsx — Black & Red theme
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const e: typeof errors = {};

    if (!email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email address.';
    }

    if (!password) {
      e.password = 'Password is required.';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    // Temporary mock authentication.
    // Database authentication will be connected later.
    await new Promise((res) => setTimeout(res, 800));

    router.push('/');
  }

  const fieldClass = (hasErr: boolean) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors ${
      hasErr
        ? 'border-red-400 dark:border-red-600'
        : 'border-zinc-200 dark:border-zinc-700 focus:border-red-500 dark:focus:border-red-500'
    }`;

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-50 dark:bg-zinc-950">

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-1 h-5 bg-red-600 rounded-sm" />

          <span className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            NewsVeil
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              Welcome back
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to continue fact-checking
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm">

            <form onSubmit={handleSubmit} noValidate className="space-y-4">

              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((p) => ({
                      ...p,
                      email: undefined,
                    }));
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={fieldClass(!!errors.email)}
                />

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((p) => ({
                        ...p,
                        password: undefined,
                      }));
                    }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={fieldClass(!!errors.password) + ' pr-10'}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    aria-label={
                      showPwd ? 'Hide password' : 'Show password'
                    }
                  >
                    {showPwd ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="text-right">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Log in'
                )}
              </button>
            </form>
          </div>

          {/* Signup link */}
          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Don&apos;t have an account?{' '}

            <Link
              href="/signup"
              className="font-semibold text-red-600 dark:text-red-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}