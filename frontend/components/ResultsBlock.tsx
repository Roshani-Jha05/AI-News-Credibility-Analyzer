'use client';

// ============================================================
// components/ResultsBlock.tsx
// NewsVeil Results
//
// Original working results layout
// ============================================================

import VerdictBadge from '@/components/VerdictBadge';
import SourceCard from '@/components/SourceCard';
import CredibilityChart from '@/components/CredibilityChart';

import type { FactCheckResult } from '@/lib/types';

interface ResultsBlockProps {
  result: FactCheckResult;
}

export default function ResultsBlock({
  result,
}: ResultsBlockProps) {
  const {
    verdict,
    confidence,
    reasoning,
    factAnalysis,
    sources,
    claim,
  } = result;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ======================================================
          TOP SECTION
          VERDICT + CREDIBILITY SCORE
      ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-4">

        {/* ====================================================
            1. FACT-CHECK VERDICT
        ==================================================== */}

        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

          <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-4">
            Fact-Check Verdict
          </p>

          <VerdictBadge
            verdict={verdict}
            size="lg"
          />

          {/* Claim */}

          <div className="mt-5 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">

            <span className="font-semibold text-zinc-400 dark:text-zinc-500">
              Claim checked:
            </span>

            <p className="mt-1 italic">
              &ldquo;
              {claim.length > 300
                ? claim.slice(0, 300) + '…'
                : claim}
              &rdquo;
            </p>

          </div>

        </div>

        {/* ====================================================
            2. CREDIBILITY SCORE
        ==================================================== */}

        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

          <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-5">
            Credibility Score
          </p>

          <CredibilityChart
            confidence={confidence}
          />

          <p className="text-center text-[11px] text-zinc-500 mt-5">
            Based on {sources.length} source
            {sources.length !== 1 ? 's' : ''} cross-referenced
            against this claim.
          </p>

        </div>

      </div>

      {/* ======================================================
          3. FACT ANALYSIS
      ====================================================== */}

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-4">
          Fact Analysis
        </p>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {factAnalysis}
        </p>

      </div>

      {/* ======================================================
          4. ANALYSIS
      ====================================================== */}

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-4">
          Analysis
        </p>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {reasoning}
        </p>

      </div>

      {/* ======================================================
          5. MATCH CONFIDENCE
      ====================================================== */}

      <div className="px-6 py-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <div className="flex items-center justify-between mb-2">

          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
            Match Confidence
          </span>

          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
            {confidence}%
          </span>

        </div>

        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">

          <div
            className="h-full rounded-full bg-red-600 transition-all duration-700"
            style={{
              width: `${Math.min(
                Math.max(confidence, 0),
                100
              )}%`,
            }}
          />

        </div>

        <p className="mt-2 text-[11px] text-zinc-500">
          Confidence reflects how strongly the retrieved
          fact-check evidence matches the submitted claim.
        </p>

      </div>

      {/* ======================================================
          6. SOURCES REVIEWED
      ====================================================== */}

      <div>

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3 px-1">
          Sources Reviewed ({sources.length})
        </p>

        {sources.length === 0 ? (

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No supporting sources were retrieved for this
              claim.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {sources.map((source, i) => (

              <SourceCard
                key={
                  source.id ??
                  `${source.url}-${i}`
                }
                source={source}
                index={i}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}