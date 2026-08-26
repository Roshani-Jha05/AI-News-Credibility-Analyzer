'use client';

// ============================================================
// components/ResultsBlock.tsx — Black & Red theme
//
// Layout (top → bottom):
//  1. Source Credibility  — VerdictBadge + real/fake % score bar
//  2. Fact Analysis       — analysis text + real/fake % score bar
//  3. AI Analysis         — reasoning text + real/fake % score bar
//  4. Sources Reviewed    — source cards (unchanged)
// ============================================================

import VerdictBadge from '@/components/VerdictBadge';
import SourceCard from '@/components/SourceCard';
import type { FactCheckResult } from '@/lib/mockData';

interface ResultsBlockProps {
  result: FactCheckResult;
}

// ── Reusable score bar ────────────────────────────────────────
// Shows "X% Real  ████████░░  Y% Fake"

function ScoreBar({
  realPercent,
  label,
}: {
  realPercent: number;
  label?: string;
}) {
  const fakePercent = 100 - realPercent;

  // Color the bar: green-ish when mostly real, red when mostly fake
  const barColor =
    realPercent >= 70
      ? 'bg-emerald-500'
      : realPercent >= 45
      ? 'bg-amber-400'
      : 'bg-red-600';

  return (
    <div className="mt-3">
      {label && (
        <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-1.5">
          {label}
        </p>
      )}
      {/* Bar */}
      <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${realPercent}%` }}
        />
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {realPercent}% Real
        </span>
        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
          {fakePercent}% Fake
        </span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────

export default function ResultsBlock({ result }: ResultsBlockProps) {
  const {
    verdict,
    confidence,
    reasoning,
    factAnalysis,
    sources,
    claim,
    sourceCredibilityScore,
    factAnalysisScore,
    aiAnalysisScore,
  } = result;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ── 1. Source Credibility (was "Verdict") ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          Source Credibility
        </p>

        {/* Verdict badge */}
        <VerdictBadge verdict={verdict} size="lg" />

        {/* Claim echo */}
        <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
          &ldquo;{claim.length > 140 ? claim.slice(0, 140) + '…' : claim}&rdquo;
        </div>

        {/* Score bar */}
        <ScoreBar realPercent={sourceCredibilityScore} label="Credibility Score" />
      </div>

      {/* ── 2. Fact Analysis (was "Flagged Portion") ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          Fact Analysis
        </p>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {factAnalysis}
        </p>

        {/* Score bar */}
        <ScoreBar realPercent={factAnalysisScore} label="Fact Accuracy Score" />
      </div>

      {/* ── 3. AI Analysis ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          AI Analysis
        </p>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {reasoning}
        </p>

        {/* Score bar */}
        <ScoreBar realPercent={aiAnalysisScore} label="AI Confidence Score" />
      </div>

      {/* ── 4. Overall Confidence (kept as-is) ── */}
      <div className="px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
            Overall Confidence
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

      {/* ── 5. Sources Reviewed ── */}
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
