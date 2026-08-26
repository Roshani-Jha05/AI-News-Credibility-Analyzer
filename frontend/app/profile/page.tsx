'use client';

// ============================================================
// app/profile/page.tsx — Black & Red theme
// ============================================================

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import VerdictBadge from '@/components/VerdictBadge';
import { MOCK_USER, MOCK_HISTORY, type HistoryEntry } from '@/lib/mockData';
import { Edit3, CheckCircle, Clock, TrendingUp, Shield } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-xl">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 mb-1">Edit Profile</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Profile editing will be wired up in a later phase once the backend is connected.
        </p>
        <button onClick={onClose} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors">
          Close
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const user = MOCK_USER;
  const [showEditModal, setShowEditModal] = useState(false);

  const statCards = [
    { icon: Shield, label: 'Total Fact-Checks', value: user.stats.totalChecks, sub: 'All time' },
    { icon: TrendingUp, label: 'Accuracy Rate', value: `${user.stats.accuracyRate}%`, sub: 'Definitive verdicts' },
    { icon: CheckCircle, label: 'Claims Verified', value: user.stats.verdictBreakdown.True + user.stats.verdictBreakdown.False, sub: 'True or False' },
    { icon: Clock, label: 'Member Since', value: formatDate(user.memberSince), sub: 'Registration date' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Navbar />
      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-white tracking-wide">{user.avatarInitials}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{user.name}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{user.email}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">Member since {formatDate(user.memberSince)}</p>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Edit3 size={13} />
            Edit Profile
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {statCards.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <Icon size={15} className="text-red-600 mb-2" />
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-none">{value}</div>
              <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1">{label}</div>
              <div className="text-[10px] text-zinc-400 dark:text-zinc-600">{sub}</div>
            </div>
          ))}
        </div>

        {/* Recent history */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <p className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
              Recent Fact-Checks
            </p>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {MOCK_HISTORY.map((entry: HistoryEntry) => (
              <div key={entry.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {entry.claim}
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mt-0.5">
                    {formatDate(entry.createdAt)} &middot; {entry.confidence}% confidence
                  </p>
                </div>
                <VerdictBadge verdict={entry.verdict} />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
