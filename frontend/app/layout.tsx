import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

// ============================================================
// app/layout.tsx — Root layout
// Wraps every page with Inter font + ThemeProvider.
// The "dark" class on <html> is the default; ThemeProvider
// corrects it from the cookie on the client after mount.
// ============================================================

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NewsVeil — AI Fact Checker',
  description:
    'Fact-check news claims instantly with AI and live web evidence. Get a verdict, confidence score, and source-backed reasoning.',
};

// Makes the page fit the phone screen width instead of a zoomed-out desktop layout
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased
          bg-zinc-50 dark:bg-zinc-950
          text-zinc-900 dark:text-zinc-50
          min-h-dvh overflow-x-clip transition-colors duration-200`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
