'use client';

import { useState } from 'react';

import { Link2, Loader2, ArrowRight } from 'lucide-react';

import type {
  AIAnalysisResult,
  SourceCredibilityResult,
} from '@/lib/mockData';

type InputMode = 'text' | 'url';

interface FactCheckInputProps {
  onResult: (result: AIAnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}

/* ============================================================
   INPUT MODE DETECTION
   ============================================================ */

function detectMode(text: string): InputMode {
  if (/^https?:\/\/\S+/i.test(text.trim())) {
    return 'url';
  }

  return 'text';
}

/* ============================================================
   FACT VERDICT → SCORE
   ============================================================ */

function getFactScore(verdict: string): number {
  switch (verdict) {
    case 'True':
      return 100;

    case 'False':
      return 0;

    case 'Misleading':
      return 50;

    case 'Unverifiable':
      return 50;

    case 'No fact-check found':
      return 50;

    default:
      return 50;
  }
}

/* ============================================================
   FINAL CREDIBILITY SCORE
   ============================================================ */

function calculateFinalCredibilityScore(
  sourceScore: number,
  factVerdict: string,
  humanProbability: number
): number {
  const safeSourceScore = Math.max(
    0,
    Math.min(100, Number(sourceScore) || 0)
  );

  const factScore = getFactScore(factVerdict);

  const safeHumanProbability = Math.max(
    0,
    Math.min(1, Number(humanProbability) || 0)
  );

  const humanScore = safeHumanProbability * 100;

  const finalScore =
    safeSourceScore * 0.40 +
    factScore * 0.40 +
    humanScore * 0.20;

  return Math.round(
    Math.max(0, Math.min(100, finalScore))
  );
}

/* ============================================================
   COMPONENT
   ============================================================ */

export default function FactCheckInput({
  onResult,
  isLoading,
  setIsLoading,
}: FactCheckInputProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<InputMode>('text');

  /* ==========================================================
     TEXT CHANGE
     ========================================================== */

  function handleTextChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const value = e.target.value;

    setText(value);

    setMode(
      value.trim()
        ? detectMode(value)
        : 'text'
    );
  }

  /* ==========================================================
     SUBMIT
     ========================================================== */

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const input = text.trim();

    if (!input) {
      alert(
        'Please enter article text or a URL.'
      );
      return;
    }

    /*
     * Only apply the 20-word minimum to
     * manually entered article text.
     *
     * URLs are extracted by the backend.
     */

    if (
      mode === 'text' &&
      input.split(/\s+/).length < 20
    ) {
      alert(
        'Please enter at least 20 words.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const body =
        mode === 'url'
          ? { url: input }
          : { text: input };

      /* ======================================================
         1. AI DETECTION
         ====================================================== */

      const aiResponse = await fetch(
        'http://127.0.0.1:8000/api/analyze',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const aiData =
        await aiResponse.json();

      if (!aiResponse.ok) {
        throw new Error(
          typeof aiData?.detail === 'string'
            ? aiData.detail
            : 'The AI analysis request failed.'
        );
      }

      /* ======================================================
         2. SOURCE CREDIBILITY
         ====================================================== */

      const sourceResponse = await fetch(
        'http://127.0.0.1:8000/api/source-credibility',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const sourceData =
        await sourceResponse.json();

      if (!sourceResponse.ok) {
        throw new Error(
          typeof sourceData?.detail === 'string'
            ? sourceData.detail
            : 'The source credibility request failed.'
        );
      }

      const sourceResult =
        sourceData as SourceCredibilityResult;

      /* ======================================================
         3. FACT CHECKING
         ====================================================== */

      const factCheckResponse = await fetch(
        'http://127.0.0.1:8000/api/fact-check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const factCheckData =
        await factCheckResponse.json();

      if (!factCheckResponse.ok) {
        throw new Error(
          typeof factCheckData?.detail === 'string'
            ? factCheckData.detail
            : 'The fact-checking request failed.'
        );
      }

      /* ======================================================
         4. SOURCE INFORMATION
         ====================================================== */

      const source =
        aiData?.source ??
        (mode === 'url'
          ? {
              type: 'url' as const,
              url: input,
            }
          : {
              type: 'text' as const,
              url: null,
            });

      /* ======================================================
         5. CALCULATE FINAL CREDIBILITY SCORE
         ====================================================== */

      const finalCredibilityScore =
        calculateFinalCredibilityScore(
          sourceResult.score,
          factCheckData.verdict,
          aiData.human_probability
        );

      /* ======================================================
         6. COMBINE ALL RESULTS
         ====================================================== */

      const combinedResult: AIAnalysisResult = {
        
        ...(aiData as AIAnalysisResult),
        

        source,

        sourceCredibility:
          sourceResult,

        factCheck:
          factCheckData,

        finalCredibilityScore,
      };

      /* ======================================================
         DEBUG LOGS
         ====================================================== */

      console.log(
        'AI response:',
        aiData
      );

      console.log(
        'Source credibility response:',
        sourceData
      );

      console.log(
        'Fact check response:',
        factCheckData
      );

      console.log(
        'Source score:',
        sourceResult.score
      );

      console.log(
        'Fact verdict:',
        factCheckData.verdict
      );

      console.log(
        'Human probability:',
        aiData.human_probability
      );

      console.log(
        'Final credibility score:',
        finalCredibilityScore
      );

      console.log(
        'Combined result:',
        combinedResult
      );

      /* ======================================================
         7. SEND RESULT TO PAGE
         ====================================================== */

      onResult(combinedResult);

    } catch (error) {
      console.error(
        'Analysis error:',
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the analysis service.'
      );

    } finally {
      setIsLoading(false);
    }
  }

  /* ==========================================================
     UI LABELS
     ========================================================== */

  const modeLabel =
    mode === 'url'
      ? 'URL detected'
      : 'Text claim';

  const modeColor =
    mode === 'url'
      ? 'text-blue-400'
      : 'text-zinc-500 dark:text-zinc-600';

  /* ==========================================================
     RENDER
     ========================================================== */

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
    >
      {/* ======================================================
          INPUT
          ====================================================== */}

      <div
        className="
          relative rounded-xl border-2
          border-zinc-200 dark:border-zinc-700
          bg-white dark:bg-zinc-900
          focus-within:border-red-500
          dark:focus-within:border-red-600
          transition-colors
        "
      >
        <textarea
          id="claim-input"
          value={text}
          onChange={handleTextChange}
          placeholder="Enter article text or paste a news URL…"
          rows={4}
          className="
            w-full px-4 pt-4 pb-2
            text-sm text-zinc-800
            dark:text-zinc-200
            placeholder-zinc-400
            dark:placeholder-zinc-600
            bg-transparent
            resize-none
            outline-none
            leading-relaxed
          "
        />

        <div
          className="
            flex items-center
            px-3 pb-3 pt-1
            gap-2
          "
        >
          <span
            className={`
              flex items-center
              gap-1
              text-[11px]
              font-medium
              ${modeColor}
            `}
          >
            {mode === 'url' && (
              <Link2 size={11} />
            )}

            {modeLabel}
          </span>
        </div>
      </div>

      {/* ======================================================
          SUBMIT BUTTON
          ====================================================== */}

      <button
        id="verify-btn"
        type="submit"
        disabled={isLoading}
        className="
          w-full sm:w-auto
          flex items-center
          justify-center
          gap-2
          px-6 py-2.5
          rounded-lg
          bg-red-600
          hover:bg-red-700
          active:bg-red-800
          text-white
          font-semibold
          text-sm
          transition-colors
          disabled:opacity-60
          disabled:cursor-not-allowed
          shadow-sm
        "
      >
        {isLoading ? (
          <>
            <Loader2
              size={15}
              className="animate-spin"
            />

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