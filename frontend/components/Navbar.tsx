'use client';

// ============================================================
// components/Navbar.tsx — Responsive navbar — Black & Red theme
//
// Desktop (md+): logo + links on the left, theme toggle + logout on the right.
// Mobile (<md):  logo on the left, theme toggle + hamburger on the right;
//                links open in a dropdown panel so nothing overflows the screen.
// ============================================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Newspaper, User, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

const NAV_ITEMS = [
  { href: '/', label: 'Verify', icon: Home },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  function isActive(href: string) {
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  }

  function handleLogout() {
    setMenuOpen(false);
    router.push('/login');
  }

  const iconBtn =
    'p-2 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur">
      <div className="max-w-6xl mx-auto h-14 px-4 sm:px-6 flex items-center justify-between gap-3">

        {/* Logo + desktop links */}
        <div className="flex items-center gap-6 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-1 h-5 bg-red-600 rounded-sm" />
            <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              NewsVeil
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'bg-red-600 text-white'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={toggleTheme} aria-label="Toggle theme" className={iconBtn}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Desktop-only logout */}
          <span className="hidden md:block w-px h-5 bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <button onClick={handleLogout} aria-label="Log out" className={`${iconBtn} hidden md:inline-flex`}>
            <LogOut size={16} />
          </button>

          {/* Mobile-only hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`${iconBtn} md:hidden`}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 top-14 z-30 bg-black/50 cursor-default"
          />
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="md:hidden absolute top-full inset-x-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 shadow-lg animate-fadeIn"
          >
            <ul className="space-y-1">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? 'bg-red-600 text-white'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </li>
                );
              })}
              <li className="pt-1 mt-1 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
