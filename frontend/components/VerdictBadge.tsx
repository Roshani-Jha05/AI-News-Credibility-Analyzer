'use client';

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import type { Verdict } from '@/lib/mockData';

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

const VERDICT_CONFIG: Record<
  Verdict,
  {
    bg: string;
    text: string;
    border: string;
    Icon: React.ElementType;
    label: string;
  }
> = {
  True: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    Icon: CheckCircle2,
    label: 'True',
  },

  False: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    Icon: XCircle,
    label: 'False',
  },

  Misleading: {
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    Icon: AlertTriangle,
    label: 'Misleading',
  },

  Unverifiable: {
    bg: 'bg-zinc-50 dark:bg-zinc-900/40',
    text: 'text-zinc-700 dark:text-zinc-300',
    border: 'border-zinc-200 dark:border-zinc-700',
    Icon: HelpCircle,
    label: 'Unverifiable',
  },

  'No fact-check found': {
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-600 dark:text-zinc-300',
    border: 'border-zinc-300 dark:border-zinc-700',
    Icon: HelpCircle,
    label: 'No fact-check found',
  },
};

export default function VerdictBadge({
  verdict,
  size = 'md',
}: VerdictBadgeProps) {
  const config = VERDICT_CONFIG[verdict];
  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 12,
    md: 15,
    lg: 18,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${sizeClasses[size]} ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon size={iconSizes[size]} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}