'use client';

// ============================================================
// app/news/page.tsx — News / Blogs screen — Black & Red theme
// ============================================================

import { useState, useMemo, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  ALL_TAGS,
  MOCK_NEWS_ARTICLES,
  type NewsArticle,
  type NewsTag,
} from '@/lib/mockData';
import { Search, X, ExternalLink, Clock, ChevronRight } from 'lucide-react';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.round(diffHr / 24);
  return `${diffDays}d ago`;
}

function getTagMeta(id: NewsTag) {
  return ALL_TAGS.find((t) => t.id === id)!;
}

// ── Thumb placeholder ─────────────────────────────────────────

function Thumb({ bg, initial }: { bg: string; initial: string }) {
  return (
    <div className={`${bg} flex items-center justify-center select-none w-full h-full`} aria-hidden="true">
      <span className="text-2xl font-bold text-white/70 tracking-widest">{initial}</span>
    </div>
  );
}

// ── Removable chip inside the search row ──────────────────────

function SelectedChip({ tag, onRemove }: { tag: NewsTag; onRemove: (t: NewsTag) => void }) {
  const meta = getTagMeta(tag);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${meta.bg} ${meta.color} shrink-0`}>
      {meta.label}
      <button onClick={(e) => { e.stopPropagation(); onRemove(tag); }} aria-label={`Remove ${meta.label} filter`} className="ml-0.5 hover:opacity-70 transition-opacity">
        <X size={10} strokeWidth={2.5} />
      </button>
    </span>
  );
}

// ── Small label pill on cards ─────────────────────────────────

function TagPill({ tag }: { tag: NewsTag }) {
  const meta = getTagMeta(tag);
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${meta.bg} ${meta.color}`}>
      {meta.label}
    </span>
  );
}

// ── Article detail modal ──────────────────────────────────────

function ArticleModal({ article, onClose }: { article: NewsArticle; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={article.headline}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* max-h + overflow-y-auto: long articles scroll inside the card on short phone screens */}
      <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl animate-fadeIn">

        {/* Banner */}
        <div className={`${article.thumbBg} h-24 sm:h-32 flex items-center justify-center`}>
          <span className="text-5xl sm:text-6xl font-black text-white/30 tracking-widest select-none">
            {article.thumbInitial}
          </span>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.tags.map((t) => <TagPill key={t} tag={t} />)}
          </div>

          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 leading-snug mb-3 break-words">
            {article.headline}
          </h2>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-5">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400 dark:text-zinc-600 mb-5 sm:mb-6">
            <span className="font-semibold text-zinc-600 dark:text-zinc-400">{article.source}</span>
            <span>·</span>
            <Clock size={11} className="shrink-0" />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              id={`read-article-${article.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold transition-colors"
            >
              Read Full Article
              <ExternalLink size={13} />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── News card ─────────────────────────────────────────────────

function NewsCard({ article, onClick }: { article: NewsArticle; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      id={`news-card-${article.id}`}
      className="group text-left w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:border-red-400 dark:hover:border-red-700 hover:shadow-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      <div className="relative w-full aspect-[16/7] overflow-hidden">
        <Thumb bg={article.thumbBg} initial={article.thumbInitial} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1">
          {article.tags.slice(0, 2).map((t) => <TagPill key={t} tag={t} />)}
        </div>

        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {article.headline}
        </h3>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          {article.preview}
        </p>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1.5 min-w-0 text-[11px] text-zinc-400 dark:text-zinc-600">
            <span className="font-medium text-zinc-500 dark:text-zinc-500 truncate">{article.source}</span>
            <span>·</span>
            <Clock size={10} className="shrink-0" />
            <span className="shrink-0">{timeAgo(article.publishedAt)}</span>
          </div>
          <ChevronRight size={14} className="shrink-0 text-zinc-300 dark:text-zinc-700 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </button>
  );
}

// ── Tag selector ──────────────────────────────────────────────

function TagSelector({
  selected,
  onToggle,
  onClearAll,
}: {
  selected: Set<NewsTag>;
  onToggle: (t: NewsTag) => void;
  onClearAll: () => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // pointerdown covers both mouse and touch
    function handleClick(e: PointerEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, []);

  const filteredTags = ALL_TAGS.filter((t) =>
    t.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div ref={wrapperRef} className="relative">
        <div
          className="flex flex-wrap items-center gap-1.5 min-h-[42px] px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-text focus-within:border-red-500 dark:focus-within:border-red-600 transition-colors"
          onClick={() => { setOpen(true); inputRef.current?.focus(); }}
        >
          <Search size={15} className="text-zinc-400 dark:text-zinc-600 shrink-0 mr-0.5" />

          {[...selected].map((t) => (
            <SelectedChip key={t} tag={t} onRemove={onToggle} />
          ))}

          <input
            ref={inputRef}
            id="news-tag-search"
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={selected.size === 0 ? 'Filter by topic…' : ''}
            className="flex-1 min-w-[100px] bg-transparent text-sm text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none"
          />

          {selected.size > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onClearAll(); setQuery(''); }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors ml-auto shrink-0"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Dropdown */}
        {open && filteredTags.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden">
            <div className="p-2 flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              {filteredTags.map((tag) => {
                const isActive = selected.has(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={(e) => { e.stopPropagation(); onToggle(tag.id); setQuery(''); }}
                    className={`px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? `${tag.bg} ${tag.color} ring-1 ring-current`
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {isActive && <span className="mr-0.5">✓ </span>}
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selected.size > 0 && (
        <p className="text-xs text-zinc-400 dark:text-zinc-600 break-words">
          Showing articles tagged with{' '}
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">
            {[...selected].map((t) => getTagMeta(t).label).join(', ')}
          </span>
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────

export default function NewsPage() {
  const [selectedTags, setSelectedTags] = useState<Set<NewsTag>>(new Set());
  const [openArticle, setOpenArticle] = useState<NewsArticle | null>(null);

  function toggleTag(tag: NewsTag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function clearAllTags() {
    setSelectedTags(new Set());
  }

  const visibleArticles = useMemo(() => {
    if (selectedTags.size === 0) return MOCK_NEWS_ARTICLES;
    return MOCK_NEWS_ARTICLES.filter((a) => a.tags.some((t) => selectedTags.has(t)));
  }, [selectedTags]);

  return (
    <div className="flex flex-col min-h-dvh bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      {openArticle && (
        <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
            News &amp; Blogs
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Browse headlines across topics — click any card to read more or fact-check the claim.
          </p>
        </div>

        <div className="mb-6 sm:mb-8">
          <TagSelector selected={selectedTags} onToggle={toggleTag} onClearAll={clearAllTags} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
            {visibleArticles.length} {visibleArticles.length === 1 ? 'article' : 'articles'}
            {selectedTags.size > 0 ? ' matched' : ''}
          </span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
        </div>

        {visibleArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleArticles.map((article) => (
              <NewsCard key={article.id} article={article} onClick={() => setOpenArticle(article)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200 mb-1">No articles found</p>
            <p className="text-sm text-zinc-400 dark:text-zinc-600">Try removing a tag or clearing all filters.</p>
            <button
              onClick={clearAllTags}
              className="mt-4 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
