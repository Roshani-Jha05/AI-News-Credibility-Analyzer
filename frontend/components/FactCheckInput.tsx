'use client';

// ============================================================
// components/FactCheckInput.tsx
// Unified input area accepting text or URL only.
// Image upload removed — text/URL detection only.
// Phase 4: replace the fake delay + mock with real fetch().
// ============================================================

import * as React from 'react';
import { Link2, Loader2, ArrowRight } from 'lucide-react';
import type { FactCheckResult } from '@/lib/types';
type InputMode = 'text' | 'url';

interface FactCheckInputProps {
  onResult: (result: FactCheckResult) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

function detectMode(text: string): InputMode {
  if (/^https?:\/\//i.test(text.trim())) return 'url';
  return 'text';
}

export default function FactCheckInput({ onResult, isLoading, setIsLoading }: FactCheckInputProps) {
  const [text, setText] = React.useState('');
const [mode, setMode] = React.useState<InputMode>('text');

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    setMode(val.trim() ? detectMode(val) : 'text');
  }

async function handleSubmit(e: any) {
  e.preventDefault();

  if (!text.trim()) {
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(
  `http://127.0.0.1:8000/analyze?claim=${encodeURIComponent(text.trim())}`,
  {
      method: 'POST',
    }
  );

    if (!response.ok) {
      throw new Error('Failed to connect to backend');
    }

  const data = await response.json();

     const result: FactCheckResult = {
    id: data.id,
    verdict: data.verdict,
    confidence: data.confidence,
    reasoning: data.reasoning,
    factAnalysis: data.factAnalysis,
    sources: data.sources,
    claim: data.claim,
    authenticPercent: data.authenticPercent,
    sourceCredibilityScore: data.sourceCredibilityScore,
    factAnalysisScore: data.factAnalysisScore,
    aiAnalysisScore: data.aiAnalysisScore,
  };

onResult(result);
  } catch (error) {
    console.error('Backend error:', error);
    alert('Could not connect to FastAPI.');
  } finally {
    setIsLoading(false);
  }
}

  const modeLabel = mode === 'url' ? 'URL detected' : 'Text claim';
  const modeColor = mode === 'url' ? 'text-blue-400' : 'text-zinc-500 dark:text-zinc-600';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div
        className="relative rounded-xl border-2 border-zinc-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          focus-within:border-red-500 dark:focus-within:border-red-600
          transition-colors"
      >
        <textarea
          id="claim-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter a claim to fact-check or paste a news URL…"
          rows={4}
          className="w-full px-4 pt-4 pb-2 text-sm text-zinc-800 dark:text-zinc-200
            placeholder-zinc-400 dark:placeholder-zinc-600
            bg-transparent resize-none outline-none leading-relaxed"
        />

        {/* Bottom row: mode label */}
        <div className="flex items-center px-3 pb-3 pt-1 gap-2">
          <span className={`flex items-center gap-1 text-[11px] font-medium ${modeColor}`}>
            {mode === 'url' && <Link2 size={11} />}
            {modeLabel}
          </span>
        </div>
      </div>

      <button
        id="verify-btn"
        type="submit"
        disabled={isLoading}
        className="w-full sm:w-auto flex items-center justify-center gap-2
          px-6 py-2.5 rounded-lg
          bg-red-600 hover:bg-red-700 active:bg-red-800
          text-white font-semibold text-sm
          transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? (
          <><Loader2 size={15} className="animate-spin" />Analysing…</>
        ) : (
          <>Verify Claim<ArrowRight size={15} /></>
        )}
      </button>
    </form>
  );
}
