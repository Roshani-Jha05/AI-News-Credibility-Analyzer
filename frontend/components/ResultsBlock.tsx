'use client';

// ============================================================
// components/ResultsBlock.tsx
//
// Layout:
//  1. Source Credibility
//  2. Fact Analysis
//  3. AI Analysis — REAL AI ENGINE RESULT
//  4. Overall Confidence
// ============================================================

import VerdictBadge from '@/components/VerdictBadge';

import type {
  FactCheckResult,
  AIAnalysisResult,
} from '@/lib/mockData';

interface ResultsBlockProps {
  result: FactCheckResult;
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
  const safePercent = Math.max(
    0,
    Math.min(100, realPercent)
  );

  const questionablePercent = 100 - safePercent;

  const barColor =
    safePercent >= 70
      ? 'bg-emerald-500'
      : safePercent >= 45
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
          style={{
            width: `${safePercent}%`,
          }}
        />
      </div>

      <div className="flex justify-between mt-1">

        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {safePercent}% Authentic
        </span>

        <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
          {questionablePercent}% Questionable
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
    factAnalysis,
    claim,
  } = result;

  // ------------------------------------------------------------
  // FINAL CREDIBILITY SCORE
  // ------------------------------------------------------------

  const finalCredibilityScore =
    aiResult?.finalCredibilityScore ?? 0;

  // ------------------------------------------------------------
  // SOURCE CREDIBILITY SCORE
  // ------------------------------------------------------------

  const sourceCredibilityScore =
    aiResult?.sourceCredibility?.score ?? 0;

  // ------------------------------------------------------------
  // LINGUISTIC FEATURES
  // ------------------------------------------------------------

  const linguisticFeatures =
    aiResult?.linguistic_features;

  const perplexity =
    linguisticFeatures?.perplexity ?? null;

  const burstiness =
    linguisticFeatures?.burstiness ?? null;

  const vocabularyDiversity =
    linguisticFeatures?.vocabulary_diversity ?? null;

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* ======================================================
          1. SOURCE CREDIBILITY
          ====================================================== */}

      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
          Source Credibility
        </p>

        <VerdictBadge
          verdict={verdict}
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

        {/* Real source credibility information */}

        {aiResult?.sourceCredibility && (
          <div className="mt-4">

            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {aiResult.sourceCredibility.source}
            </p>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {aiResult.sourceCredibility.label}
            </p>

            {aiResult.sourceCredibility.reasons?.length > 0 && (
              <ul className="mt-2 space-y-1">

                {aiResult.sourceCredibility.reasons.map(
                  (reason, index) => (
                    <li
                      key={index}
                      className="text-xs text-zinc-500 dark:text-zinc-400"
                    >
                      • {reason}
                    </li>
                  )
                )}

              </ul>
            )}

          </div>
        )}

      </div>


      {/* ======================================================
          2. FACT ANALYSIS
          ====================================================== */}

      {aiResult?.factCheck && (
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

          {/* FACT-CHECK VERDICT */}

          <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
            Fact-Check Verdict
          </p>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              aiResult.factCheck.verdict === 'False'
                ? 'bg-red-950/40 text-red-400 border-red-800'
                : aiResult.factCheck.verdict === 'True'
                ? 'bg-green-950/40 text-green-400 border-green-800'
                : aiResult.factCheck.verdict === 'Misleading'
                ? 'bg-amber-950/40 text-amber-400 border-amber-800'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            {aiResult.factCheck.verdict === 'False'
              ? '✕ Verified False'
              : aiResult.factCheck.verdict === 'True'
              ? '✓ Verified True'
              : aiResult.factCheck.verdict}
          </div>

          {/* CLAIM CHECKED */}

          <div className="mt-4 border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">

            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              Claim checked:
            </p>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed italic">
              &ldquo;{aiResult.factCheck.claim}&rdquo;
            </p>

          </div>

          {/* FACT ANALYSIS */}

          <div className="mt-6">

            <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
              Fact Analysis
            </p>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {aiResult.factCheck.factAnalysis}
            </p>

          </div>

          {/* ANALYSIS */}

          <div className="mt-6">

            <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-3">
              Analysis
            </p>

            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {aiResult.factCheck.reasoning}
            </p>

          </div>

          {/* MATCH CONFIDENCE */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-2">

              <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                Match Confidence
              </p>

              <span
                className={`text-sm font-bold ${
                  aiResult.factCheck.verdict === 'True'
                    ? 'text-emerald-500'
                    : aiResult.factCheck.verdict === 'False'
                    ? 'text-red-500'
                    : 'text-zinc-700 dark:text-zinc-200'
                }`}
              >
                {aiResult.factCheck.confidence}%
              </span>

            </div>

            <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  aiResult.factCheck.verdict === 'False'
                    ? 'bg-red-600'
                    : aiResult.factCheck.verdict === 'True'
                    ? 'bg-emerald-500'
                    : aiResult.factCheck.verdict === 'Misleading'
                    ? 'bg-amber-400'
                    : 'bg-zinc-500'
                }`}
                style={{
                  width: `${Math.max(
                    0,
                    Math.min(
                      100,
                      aiResult.factCheck.confidence
                    )
                  )}%`,
                }}
              />

            </div>

            <p className="mt-2 text-[10px] text-zinc-400 dark:text-zinc-600">
              Confidence reflects how strongly the retrieved fact-check evidence
              matches the submitted claim.
            </p>

          </div>

        </div>
      )}


      {/* ======================================================
          3. AI ANALYSIS — REAL AI ENGINE RESULT
          ====================================================== */}

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


            {/* Linguistic Evidence */}

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
                    {perplexity !== null
                      ? perplexity.toFixed(2)
                      : 'N/A'}
                  </p>

                </div>


                {/* Burstiness */}

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">

                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Burstiness
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {burstiness !== null
                      ? burstiness.toFixed(3)
                      : 'N/A'}
                  </p>

                </div>


                {/* Vocabulary diversity */}

                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">

                  <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                    Vocabulary diversity
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {vocabularyDiversity !== null
                      ? vocabularyDiversity.toFixed(3)
                      : 'N/A'}
                  </p>

                </div>

              </div>

              {!linguisticFeatures && (
                <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
                  Linguistic feature data was not returned by the AI analysis service.
                </p>
              )}

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


      {/* ======================================================
          4. OVERALL CONFIDENCE
          ====================================================== */}

      <div className="px-5 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">

        <div className="flex items-center justify-between mb-1.5">

          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
            Overall Confidence
          </span>

          <span
            className={`text-sm font-bold ${
              finalCredibilityScore >= 70
                ? 'text-emerald-600 dark:text-emerald-400'
                : finalCredibilityScore < 45
                ? 'text-red-600 dark:text-red-400'
                : 'text-amber-500 dark:text-amber-400'
            }`}
          >
            {finalCredibilityScore}%
          </span>

        </div>

        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">

          <div
            className={`h-full rounded-full transition-all duration-700 ${
              finalCredibilityScore >= 70
                ? 'bg-emerald-500'
                : finalCredibilityScore < 45
                ? 'bg-red-600'
                : 'bg-amber-400'
            }`}
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  finalCredibilityScore
                )
              )}%`,
            }}
          />

        </div>

        <div className="flex justify-between mt-1">

          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {finalCredibilityScore}% Authentic
          </span>

          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
            {100 - finalCredibilityScore}% Questionable
          </span>

        </div>

      </div>

    </div>
  );
}