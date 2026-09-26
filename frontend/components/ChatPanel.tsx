'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

import type { AIAnalysisResult } from '@/lib/mockData';

interface ChatPanelProps {
  analysis: AIAnalysisResult;
}

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
}

function generateReply(
  question: string,
  analysis: AIAnalysisResult
): string {
  const q = question.toLowerCase();

  const score = analysis.finalCredibilityScore;
  const sourceScore = analysis.sourceCredibility.score;
  const verdict = analysis.factCheck.verdict;
  const aiProbability = Math.round(
    analysis.ai_probability * 100
  );
  const humanProbability = Math.round(
    analysis.human_probability * 100
  );

  // Final credibility score
  if (
    q.includes('final score') ||
    q.includes('credibility score') ||
    q.includes('why did') && q.includes('score') ||
    q.includes('overall score')
  ) {
    return (
      `The final credibility score is ${score}%. ` +
      `It combines three parts of the analysis: source credibility ` +
      `(${sourceScore}% contribution basis), fact-checking ` +
      `(${verdict}), and the AI-content analysis ` +
      `(${humanProbability}% human-written probability).`
    );
  }

  // Source credibility
  if (
    q.includes('source') ||
    q.includes('website') ||
    q.includes('publisher')
  ) {
    return (
      `The source credibility score is ${sourceScore}%. ` +
      `The source analysis considers factors such as the domain, ` +
      `HTTPS usage, available publisher information, and whether ` +
      `the source is recognised as reliable.`
    );
  }

  // Fact checking
  if (
    q.includes('fact check') ||
    q.includes('fact-check') ||
    q.includes('verdict') ||
    q.includes('claim')
  ) {
    return (
      `The fact-check result is "${verdict}". ` +
      `${analysis.factCheck.reasoning || analysis.factCheck.factAnalysis}`
    );
  }

  // AI detection
  if (
    q.includes('ai') ||
    q.includes('artificial intelligence') ||
    q.includes('human written') ||
    q.includes('human-written') ||
    q.includes('generated')
  ) {
    return (
      `The AI-content detector estimates a ${aiProbability}% ` +
      `AI-generated probability and a ${humanProbability}% ` +
      `human-written probability. The detector classified the ` +
      `article as "${analysis.prediction}" with ${analysis.confidence} confidence.`
    );
  }

  // Linguistic analysis
  if (
    q.includes('linguistic') ||
    q.includes('perplexity') ||
    q.includes('burstiness') ||
    q.includes('writing style')
  ) {
    const features = analysis.linguistic_features;

    return (
      `The linguistic analysis found a perplexity of ` +
      `${features.perplexity.toFixed(2)}, burstiness of ` +
      `${features.burstiness.toFixed(2)}, and vocabulary diversity of ` +
      `${features.vocabulary_diversity.toFixed(2)}. ` +
      `${analysis.linguistic_evidence.overall}`
    );
  }

  // Help / general
  if (
    q.includes('help') ||
    q.includes('what can you') ||
    q.includes('what does this')
  ) {
    return (
      `I can explain this analysis. You can ask me about the ` +
      `final credibility score, source credibility, fact-checking ` +
      `result, AI detection, or the linguistic analysis.`
    );
  }

  // Generic fallback
  return (
    `Based on the current analysis, the final credibility score ` +
    `is ${score}%. The article was classified as ` +
    `"${analysis.prediction}", the fact-check verdict is ` +
    `"${verdict}", and the source credibility score is ` +
    `${sourceScore}%. Try asking me why the score was given, ` +
    `how the AI detection works, or what the fact-check result means.`
  );
}

export default function ChatPanel({
  analysis,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content:
        'Hi! I can explain the results of this credibility analysis. Ask me about the score, source, fact-check, or AI detection.',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const question = input.trim();

    if (!question || isTyping) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: question,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateReply(
        question,
        analysis
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
        },
      ]);

      setIsTyping(false);
    }, 500);
  }

  return (
    <div className="h-full flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.role === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >

            {message.role === 'assistant' && (
              <div className="w-7 h-7 shrink-0 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
                <Bot
                  size={14}
                  className="text-red-600"
                />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {message.content}
            </div>

            {message.role === 'user' && (
              <div className="w-7 h-7 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                <User
                  size={14}
                  className="text-zinc-600 dark:text-zinc-300"
                />
              </div>
            )}

          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <Bot
                size={14}
                className="text-red-600"
              />
            </div>

            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-xs text-zinc-400">
              Thinking...
            </div>
          </div>
        )}

      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-200 dark:border-zinc-800 p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          placeholder="Ask about this analysis..."
          disabled={isTyping}
          className="
            flex-1
            px-3 py-2
            rounded-lg
            border border-zinc-200
            dark:border-zinc-700
            bg-zinc-50
            dark:bg-zinc-950
            text-xs
            text-zinc-800
            dark:text-zinc-200
            placeholder-zinc-400
            outline-none
            focus:border-red-500
          "
        />

        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="
            w-9 h-9
            shrink-0
            rounded-lg
            bg-red-600
            hover:bg-red-700
            disabled:opacity-40
            disabled:cursor-not-allowed
            text-white
            flex items-center
            justify-center
            transition-colors
          "
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}