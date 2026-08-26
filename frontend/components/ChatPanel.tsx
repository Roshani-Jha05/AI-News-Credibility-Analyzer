'use client';

// ============================================================
// components/ChatPanel.tsx — Black & Red theme
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { MOCK_CHAT_REPLIES, type ChatMessage } from '@/lib/mockData';

interface ChatPanelProps {
  factCheckId: string;
}

export default function ChatPanel({ factCheckId: _factCheckId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-0',
      role: 'assistant',
      content:
        "I've reviewed this claim and its sources. Ask me anything about the verdict — I can explain the reasoning, dig into specific sources, or give you more context.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyIndexRef = useRef(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise((res) => setTimeout(res, 900 + Math.random() * 400));

    const replyText = MOCK_CHAT_REPLIES[replyIndexRef.current % MOCK_CHAT_REPLIES.length];
    replyIndexRef.current++;

    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant',
      content: replyText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <Bot size={15} className="text-red-600" />
        <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
          Ask NewsVeil
        </span>
        <span className="ml-auto text-[11px] text-zinc-400 dark:text-zinc-600">
          Scoped to this check
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed
                ${msg.role === 'user'
                  ? 'bg-red-600 text-white rounded-br-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-sm'
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl rounded-bl-sm px-3 py-2.5">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="px-3 py-2.5 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1.5 focus-within:border-red-500 dark:focus-within:border-red-600 transition-colors">
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question…"
            className="flex-1 text-sm bg-transparent text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="p-1 rounded-md text-red-600 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1 px-1">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
