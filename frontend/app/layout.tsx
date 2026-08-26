import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

// ============================================================
// app/layout.tsx — Root layout
// Font: Plus Jakarta Sans — clean, editorial, modern.
// Larger base size defined in globals.css.
// ThemeProvider reads the "theme" cookie to avoid hydration flash.
// ============================================================

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NewsVeil — AI Fact Checker',
  description:
    'Fact-check news claims instantly with AI and live web evidence. Get a verdict, confidence score, and source-backed reasoning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} font-sans antialiased
          bg-zinc-50 dark:bg-zinc-950
          text-zinc-900 dark:text-zinc-50
          min-h-screen transition-colors duration-200`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
