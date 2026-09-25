'use client';

// ============================================================
// components/ResultsBlock.tsx — Black & Red theme
// ============================================================

import VerdictBadge from '@/components/VerdictBadge';
import SourceCard from '@/components/SourceCard';
import type { FactCheckResult } from '@/lib/mockData';
import { Quote } from 'lucide-react';

interface ResultsBlockProps {
  result: FactCheckResult;
}

export default function ResultsBlock({ result }: ResultsBlockProps) {
  const { verdict, confidence, reasoning, flaggedPortion, sources, claim } = result;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ── Verdict + confidence card ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex flex-col gap-4">

          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-2">
              Verdict
            </p>
            <VerdictBadge verdict={verdict} size="lg" />
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                Confidence
              </span>
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">{confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-600 transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Claim echo */}
          <div className="text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
            &ldquo;{claim.length > 140 ? claim.slice(0, 140) + '…' : claim}&rdquo;
          </div>
        </div>
      </div>

      {/* ── Flagged portion (only for Misleading) ── */}
      {flaggedPortion && (
        <div className="flex gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
          <Quote size={18} className="shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-red-600 dark:text-red-400 mb-1">
              Flagged Portion
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-200 font-medium leading-relaxed">
              &ldquo;…{flaggedPortion}…&rdquo;
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
              This specific part of the claim is where the evidence diverges most significantly.
            </p>
          </div>
        </div>
      )}

      {/* ── AI reasoning ── */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-2">
          AI Analysis
        </p>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{reasoning}</p>
      </div>

      {/* ── Sources ── */}
      <div>
        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-2 px-1">
          Sources Reviewed ({sources.length})
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sources.map((source, i) => (
            <SourceCard key={source.id} source={source} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
