'use client';

// ============================================================
// app/signup/page.tsx — Black & Red theme
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const e: FormErrors = {};
    if (!name.trim()) e.name = 'Name is required.';
    else if (name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!confirm) e.confirm = 'Please confirm your password.';
    else if (confirm !== password) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 900));
    router.push('/');
  }

  function clearError(field: keyof FormErrors) {
    setErrors((p) => ({ ...p, [field]: undefined }));
  }

  const fieldClass = (hasErr: boolean) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition-colors ${
      hasErr
        ? 'border-red-400 dark:border-red-600'
        : 'border-zinc-200 dark:border-zinc-700 focus:border-red-500 dark:focus:border-red-500'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-1 h-5 bg-red-600 rounded-sm" />
          <span className="font-sans text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">NewsVeil</span>
        </Link>
        <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">Create your account</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Start fact-checking in seconds</p>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label htmlFor="signup-name" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input id="signup-name" type="text" value={name} onChange={(e) => { setName(e.target.value); clearError('name'); }} placeholder="Harsha" autoComplete="name" className={fieldClass(!!errors.name)} />
                {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
                <input id="signup-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError('email'); }} placeholder="you@example.com" autoComplete="email" className={fieldClass(!!errors.email)} />
                {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input id="signup-password" type={showPwd ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); clearError('password'); clearError('confirm'); }} placeholder="Min. 8 characters" autoComplete="new-password" className={fieldClass(!!errors.password) + ' pr-10'} />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" aria-label={showPwd ? 'Hide' : 'Show'}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="signup-confirm" className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input id="signup-confirm" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); clearError('confirm'); }} placeholder="••••••••" autoComplete="new-password" className={fieldClass(!!errors.confirm) + ' pr-10'} />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" aria-label={showConfirm ? 'Hide' : 'Show'}>
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.confirm}</p>}
              </div>

              <button id="signup-submit-btn" type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {isSubmitting ? <><Loader2 size={15} className="animate-spin" />Creating account…</> : 'Create Account'}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-red-600 dark:text-red-400 hover:underline">Log in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
