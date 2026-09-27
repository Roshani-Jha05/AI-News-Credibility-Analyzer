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

function buildAnalysisContext(
  analysis: AIAnalysisResult
): string {
  const source = analysis.sourceCredibility;
  const factCheck = analysis.factCheck;
  const features = analysis.linguistic_features;

  const reasons =
    source.reasons?.length > 0
      ? source.reasons.map((reason) => `- ${reason}`).join('\n')
      : 'No source credibility reasons were provided.';

  return `
SOURCE CREDIBILITY
Source: ${source.source}
Score: ${source.score}%
Label: ${source.label}
Input type: ${source.input_type}

Source reasons:
${reasons}

FACT-CHECK
Verdict: ${factCheck.verdict}
Match confidence: ${factCheck.confidence}%
Claim: ${factCheck.claim}
Fact analysis: ${factCheck.factAnalysis}
Reasoning: ${factCheck.reasoning}

AI CONTENT ANALYSIS
Prediction: ${analysis.prediction}
Confidence: ${analysis.confidence}
AI probability: ${(analysis.ai_probability * 100).toFixed(1)}%
Human probability: ${(analysis.human_probability * 100).toFixed(1)}%

LINGUISTIC FEATURES
Perplexity: ${features.perplexity.toFixed(2)}
Burstiness: ${features.burstiness.toFixed(3)}
Vocabulary diversity: ${features.vocabulary_diversity.toFixed(3)}
Sentence count: ${features.sentence_count}
Average sentence length: ${features.average_sentence_length.toFixed(2)}
Word count: ${features.word_count}

LINGUISTIC EVIDENCE
Overall: ${analysis.linguistic_evidence.overall}

FINAL CREDIBILITY SCORE
${analysis.finalCredibilityScore}%
`;
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

  async function handleSubmit(
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

    try {
      const factCheckContext =
        buildAnalysisContext(analysis);

      const response = await fetch(
        'http://127.0.0.1:8000/api/chat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            fact_check_context: factCheckContext,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === 'string'
            ? data.detail
            : 'The chatbot request failed.'
        );
      }

      const reply =
        typeof data?.answer === 'string'
          ? data.answer
          : 'Sorry, I could not generate a response.';

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
        },
      ]);

    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content:
            error instanceof Error
              ? error.message
              : 'Sorry, I could not connect to the chatbot.',
        },
      ]);

    } finally {
      setIsTyping(false);
    }
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