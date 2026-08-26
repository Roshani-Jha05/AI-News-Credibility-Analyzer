'use client';

// ============================================================
// components/ThemeProvider.tsx
// Manages dark/light mode for the whole app.
// - Reads the initial theme from a cookie (for SSR consistency)
// - Toggles by adding/removing class "dark" on <html>
// - Persists choice in a cookie (not localStorage) so Next.js
//   server components can read it before rendering
// ============================================================

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggleTheme: () => {},
});

// Helper: read a specific cookie by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Helper: set a cookie that lasts 1 year
function setCookie(name: string, value: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default to 'dark' — will be corrected by cookie on mount
  const [theme, setTheme] = useState<Theme>('dark');

  // On first render (client side), read the saved cookie
  useEffect(() => {
    const saved = getCookie('theme') as Theme | null;
    const initial = saved === 'light' ? 'light' : 'dark';
    setTheme(initial);
    applyThemeToDocument(initial);
  }, []);

  // Apply theme to the <html> element so Tailwind dark: variants work
  function applyThemeToDocument(t: Theme) {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      applyThemeToDocument(next);
      setCookie('theme', next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook — import this anywhere you need the theme
export function useTheme() {
  return useContext(ThemeContext);
}
