'use client';

// ============================================================
// app/page.tsx — Verify page — Black & Red theme
// ============================================================

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import FactCheckInput from '@/components/FactCheckInput';
import ResultsBlock from '@/components/ResultsBlock';
import CredibilityChart from '@/components/CredibilityChart';
import ChatPanel from '@/components/ChatPanel';

import {
  MOCK_FACT_CHECK_RESULT,
  type FactCheckResult,
  type AIAnalysisResult,
} from '@/lib/mockData';

import { Layers, MessageSquare } from 'lucide-react';

export default function HomePage() {
  // Existing result object used by the teammate's UI sections.
  const [result, setResult] = useState<FactCheckResult | null>(null);

  // Real result returned by our AI Detection Engine.
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  function handleResult(r: AIAnalysisResult) {
    // Store the REAL AI analysis result.
    setAiResult(r);

    // Keep the existing mock result temporarily for
    // the other sections of the teammate's frontend.
    setResult({
      ...MOCK_FACT_CHECK_RESULT,
      id: `ai-${Date.now()}`,
      claim:
        r.source.type === 'url'
          ? r.source.url || 'Article URL'
          : 'Submitted article text',
    });

    // Scroll to results after rendering.
    setTimeout(() => {
      document
        .getElementById('results-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  function handleClear() {
    setResult(null);
    setAiResult(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
            Fact-Check a Claim
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Submit a claim or news URL — NewsVeil will verify it against live sources using AI.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-2xl">
          <FactCheckInput
            onResult={handleResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="mt-8 space-y-4 animate-pulse">
            <div className="flex gap-5">
              <div className="flex-1 space-y-3">
                <div className="h-36 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />

                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-20 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>

              <div className="hidden lg:block w-72 h-64 rounded-xl bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            </div>

            <div className="h-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}

        {/* Results */}
        {result && aiResult && !isLoading && (
          <div id="results-section" className="mt-8 space-y-5">

            {/* Results heading */}
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-red-600" />

              <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                Analysis Results
              </span>

              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />

              <button
                onClick={handleClear}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Row 1: results + chart */}
            <div className="flex flex-col lg:flex-row gap-5 items-start">

              {/* Results */}
              <div className="flex-1 min-w-0">
                <ResultsBlock
                  result={result}
                  aiResult={aiResult}
                />
              </div>

              {/* Credibility chart */}
              <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-20">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">

                  <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 mb-4">
                    Credibility Score
                  </p>

                  <div className="flex justify-center">
                    <CredibilityChart
                       authenticPercent={aiResult.finalCredibilityScore}
                      confidence={Math.round(aiResult.finalCredibilityScore)}
                    />
                  </div>

                  <p className="mt-4 text-[11px] text-center text-zinc-400 dark:text-zinc-600 leading-relaxed">
                    Based on source credibility, fact-checking, and AI-content analysis.  
                  </p>

                </div>
              </div>

            </div>

            {/* Row 2: chat */}
            <div>

              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={14} className="text-red-600" />

                <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                  Follow-up Questions
                </span>

                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="h-80">
                <ChatPanel
                  analysis={aiResult}
                />
              </div>

            </div>

          </div>
        )}

        {/* Empty state */}
        {!result && !isLoading && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">

            {[
              {
                title: 'Text Claims',
                desc: 'Paste any statement or headline and get an instant AI verdict with source citations.',
                icon: '✦',
              },
              {
                title: 'News URLs',
                desc: 'Drop a link — TruthLens extracts and analyses the full article automatically.',
                icon: '⌕',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <span className="text-lg text-red-600">
                  {card.icon}
                </span>

                <h3 className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {card.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}