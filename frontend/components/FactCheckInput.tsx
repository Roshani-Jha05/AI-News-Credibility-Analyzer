'use client';

// ============================================================
// components/FactCheckInput.tsx
// Unified input area accepting text or URL only.
// Image upload removed — text/URL detection only.
// ============================================================

import { useState } from 'react';
import { Link2, Loader2, ArrowRight } from 'lucide-react';
import type { AIAnalysisResult } from '@/lib/mockData';

type InputMode = 'text' | 'url';

interface FactCheckInputProps {
  onResult: (result: AIAnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

function detectMode(text: string): InputMode {
  if (/^https?:\/\/\S+/i.test(text.trim())) return 'url';
  return 'text';
}

export default function FactCheckInput({
  onResult,
  isLoading,
  setIsLoading,
}: FactCheckInputProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<InputMode>('text');

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;

    setText(val);
    setMode(val.trim() ? detectMode(val) : 'text');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const input = text.trim();

    if (!input) {
      alert('Please enter article text or a URL.');
      return;
    }

    if (mode === 'text' && input.split(/\s+/).length < 20) {
      alert('Please enter at least 20 words.');
      return;
    }

    setIsLoading(true);

    try {
      const body =
        mode === 'url'
          ? { url: input }
          : { text: input };

      const response = await fetch(
        'http://127.0.0.1:8000/api/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === 'string'
            ? data.detail
            : 'The AI analysis request failed.'
        );
      }

      onResult(data as AIAnalysisResult);
    } catch (error) {
      console.error('AI analysis error:', error);

      alert(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the AI analysis service.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  const modeLabel = mode === 'url' ? 'URL detected' : 'Text claim';

  const modeColor =
    mode === 'url'
      ? 'text-blue-400'
      : 'text-zinc-500 dark:text-zinc-600';

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
          placeholder="Enter article text or paste a news URL…"
          rows={4}
          className="w-full px-4 pt-4 pb-2 text-sm text-zinc-800 dark:text-zinc-200
            placeholder-zinc-400 dark:placeholder-zinc-600
            bg-transparent resize-none outline-none leading-relaxed"
        />

        {/* Bottom row: mode label */}
        <div className="flex items-center px-3 pb-3 pt-1 gap-2">
          <span
            className={`flex items-center gap-1 text-[11px] font-medium ${modeColor}`}
          >
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
          <>
            <Loader2 size={15} className="animate-spin" />
            Analysing…
          </>
        ) : (
          <>
            Analyse Content
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}