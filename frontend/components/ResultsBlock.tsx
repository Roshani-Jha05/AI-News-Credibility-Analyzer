'use client';

// ============================================================
// components/ResultsBlock.tsx — Black & Red theme
//
// Layout:
//  1. Source Credibility
//  2. Fact Analysis
//  3. AI Analysis — REAL AI ENGINE RESULT
//  4. Overall Confidence
//  5. Sources Reviewed
// ============================================================

import VerdictBadge from '@/components/VerdictBadge';
import SourceCard from '@/components/SourceCard';

import type {
  FactCheckResult,
  AIAnalysisResult,
} from '@/lib/mockData';

interface ResultsBlockProps {
  // Existing result used by the teammate's other sections.
  result: FactCheckResult;

  // Real result produced by our AI Detection Engine.
  aiResult: AIAnalysisResult | null;
}

// ── Reusable score bar ────────────────────────────────────────

function ScoreBar({
  realPercent,
  label,
}: {
  realPercent: number;
  label?: string;
}) {
  const fakePercent = 100 - realPercent;

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

      <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${realPercent}%` }}
        />
      </div>

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

export default function ResultsBlock({
  result,
  aiResult,
}: ResultsBlockProps) {
  const {
    verdict,
    confidence,
    factAnalysis,
    sources,
    claim,
    sourceCredibilityScore,
    factAnalysisScore,
  } = result;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ── 1. Source Credibility ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          Source Credibility
        </p>

        <VerdictBadge
          verdict={verdict}
          size="lg"
        />

        <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-500 italic leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-3">
          &ldquo;
          {claim.length > 140
            ? claim.slice(0, 140) + '…'
            : claim}
          &rdquo;
        </div>

        <ScoreBar
          realPercent={sourceCredibilityScore}
          label="Credibility Score"
        />
      </div>

      {/* ── 2. Fact Analysis ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          Fact Analysis
        </p>

        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {factAnalysis}
        </p>

        <ScoreBar
          realPercent={factAnalysisScore}
          label="Fact Accuracy Score"
        />
      </div>

      {/* ── 3. AI Analysis — REAL AI ENGINE RESULT ── */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          AI Analysis
        </p>

        {aiResult ? (
          <>
            {/* Prediction + AI probability */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {aiResult.prediction}
                </p>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Confidence: {aiResult.confidence}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                  {(aiResult.ai_probability * 100).toFixed(1)}%
                </p>

                <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                  AI probability
                </p>
              </div>
            </div>

            {/* AI vs Human probability */}
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-600 transition-all duration-700"
                  style={{
                    width: `${aiResult.ai_probability * 100}%`,
                  }}
                />
              </div>

              <div className="flex justify-between mt-1">
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                  {(aiResult.ai_probability * 100).toFixed(1)}% AI
                </span>

                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {(aiResult.human_probability * 100).toFixed(1)}% Human
                </span>
              </div>
            </div>

            {/* Linguistic evidence */}
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-2">
                Linguistic Evidence
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                {/* Perplexity */}
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Perplexity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {aiResult.linguistic_features.perplexity.toFixed(2)}
                  </p>
                </div>

                {/* Burstiness */}
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Burstiness
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {aiResult.linguistic_features.burstiness.toFixed(3)}
                  </p>
                </div>

                {/* Vocabulary diversity */}
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Vocabulary diversity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {aiResult.linguistic_features.vocabulary_diversity.toFixed(3)}
                  </p>
                </div>

              </div>
            </div>

            {/* Why this result */}
            <div className="mt-4 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800/50">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Why this result?
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {aiResult.prediction === 'AI-generated'
                  ? aiResult.confidence === 'High'
                    ? 'The analysis found strong patterns associated with AI-generated content, resulting in a high-confidence AI classification.'
                    : 'The analysis found some patterns associated with AI-generated content, but the evidence was not strong enough for a high-confidence classification.'
                  : aiResult.confidence === 'High'
                  ? 'The analysis found patterns more consistent with human-written content, resulting in a high-confidence human classification.'
                  : 'The analysis found mixed patterns, and the AI probability was relatively close to the decision threshold, resulting in a low-confidence human classification.'}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-zinc-500">
            No AI analysis available.
          </p>
        )}
      </div>

      {/* ── 4. Overall Confidence ── */}
      <div className="px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
            Overall Confidence
          </span>

          <span className="text-sm font-bold text-zinc-700 dark:text-zinc-200">
            {confidence}%
          </span>
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
            <SourceCard
              key={source.id}
              source={source}
              index={i}
            />
          ))}
        </div>
      </div>

    </div>
  );
}