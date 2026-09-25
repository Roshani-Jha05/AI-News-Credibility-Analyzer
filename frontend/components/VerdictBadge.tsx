'use client';

// ============================================================
// components/VerdictBadge.tsx — Black & Red theme
// Unverifiable now uses zinc; Misleading uses orange (distinct from red).
// ============================================================

import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { Verdict } from '@/lib/types';
interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'lg';
}

const VERDICT_CONFIG: Record<
  Verdict,
  { bg: string; text: string; border: string; Icon: React.ElementType; label: string }
> = {
  True: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    Icon: CheckCircle,
    label: 'Verified True',
  },
  False: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    Icon: XCircle,
    label: 'Verified False',
  },
  Misleading: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    Icon: AlertTriangle,
    label: 'Misleading',
  },
  Unverifiable: {
    bg: 'bg-zinc-100 dark:bg-zinc-800/60',
    text: 'text-zinc-600 dark:text-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    Icon: HelpCircle,
    label: 'Unverifiable',
  },
};

export default function VerdictBadge({ verdict, size = 'sm' }: VerdictBadgeProps) {
  const normalizedVerdict =  String(verdict);

const config = VERDICT_CONFIG[normalizedVerdict as Verdict];
const { bg, text, border, Icon, label } = config;
  const isLarge = size === 'lg';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-full
        ${bg} ${text} ${border}
        ${isLarge ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-0.5 text-xs'}
      `}
    >
      <Icon size={isLarge ? 16 : 12} strokeWidth={2.5} />
      {label}
    </span>
  );
}
