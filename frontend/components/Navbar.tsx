'use client';

// ============================================================
// components/Navbar.tsx — Black & Red theme
// ============================================================

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, User, Home, LogOut, Newspaper } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { href: '/',        label: 'Verify',  icon: Home },
    { href: '/news',    label: 'News',    icon: Newspaper },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-1 h-5 bg-red-600 rounded-sm" />
          <span className="font-sans text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            NewsVeil
          </span>
        </Link>

        {/* Right: nav + actions */}
        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-red-600 text-white'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}

          <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-1" />

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            href="/login"
            className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
