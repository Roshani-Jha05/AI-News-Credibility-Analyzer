'use client';

// ============================================================
// components/SourceCard.tsx — Black & Red theme
// ============================================================

import { ExternalLink, Newspaper } from 'lucide-react';
import type { Source } from '@/lib/mockData';

interface SourceCardProps {
  source: Source;
  index: number;
}

export default function SourceCard({ source, index }: SourceCardProps) {
  const formatted = new Date(source.publishedAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-red-400 dark:hover:border-red-700 hover:shadow-sm transition-all"
    >
      <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold flex items-center justify-center">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Newspaper size={11} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
            {source.publisher}
          </span>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-600 shrink-0">{formatted}</span>
        </div>
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug line-clamp-2">
          {source.title}
        </p>
      </div>
      <ExternalLink
        size={13}
        className="shrink-0 mt-0.5 text-zinc-300 dark:text-zinc-600 group-hover:text-red-500 transition-colors"
      />
    </a>
  );
}
