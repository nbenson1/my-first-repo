'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { RefreshCw, Loader2, ExternalLink, Bookmark, BookmarkCheck, Star, Clock } from 'lucide-react';
import { fetchLiveJobs } from '@/lib/jobSearch';
import { Job } from '@/types';
import FitScoreBadge from './FitScoreBadge';

const CACHE_KEY = 'jobfit_daily_top10';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Queries run every daily refresh — aerospace + manufacturing/industrial engineering
const DAILY_QUERIES = [
  'manufacturing engineer aerospace defense entry level Iowa Illinois Minnesota',
  'industrial engineer aerospace defense entry level new grad',
  'NDE NDT quality engineer aerospace entry level',
  'avionics manufacturing engineer entry level',
  'NPI process engineer aerospace manufacturing entry level',
  'lean continuous improvement engineer aerospace defense entry level',
];

interface CacheEntry {
  jobs: Job[];
  fetchedAt: number;
}

interface Props {
  onSave: (job: Job) => void;
  onUnsave: (id: string) => void;
  savedIds: Set<string>;
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DailyTopJobs({ onSave, onUnsave, savedIds }: Props) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  // Tick every minute so "X ago" stays live
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const loadFromCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return false;
      const entry: CacheEntry = JSON.parse(raw);
      if (Date.now() - entry.fetchedAt > CACHE_TTL_MS) return false;
      setJobs(entry.jobs);
      setFetchedAt(entry.fetchedAt);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    loadFromCache();
  }, [loadFromCache]);

  const runDailySearch = useCallback(async () => {
    setLoading(true);
    setError('');
    let all: Job[] = [];

    for (let i = 0; i < DAILY_QUERIES.length; i++) {
      setProgress(`Searching ${i + 1} of ${DAILY_QUERIES.length}...`);
      const { jobs: results, error: err } = await fetchLiveJobs(DAILY_QUERIES[i]);
      if (err) {
        setLoading(false);
        setProgress('');
        setError(err);
        return;
      }
      all = [...all, ...results];
    }

    // Deduplicate by company+title, sort by fit, keep top 10
    const seen = new Set<string>();
    const deduped = all
      .filter(j => {
        const key = `${j.company}|${j.title}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 10);

    const now = Date.now();
    const entry: CacheEntry = { jobs: deduped, fetchedAt: now };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));

    setJobs(deduped);
    setFetchedAt(now);
    setLoading(false);
    setProgress('');
  }, []);

  const isStale = fetchedAt ? Date.now() - fetchedAt > CACHE_TTL_MS : true;

  return (
    <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
            <Star size={15} className="text-amber-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Daily Top 10 Matches</h2>
            <div className="flex items-center gap-1.5 text-xs text-[#4a7aab]">
              <Clock size={11} />
              {fetchedAt
                ? <span>Refreshed {timeAgo(fetchedAt)}{isStale ? ' · <span class="text-amber-400">stale</span>' : ''}</span>
                : <span>Not yet fetched</span>}
            </div>
          </div>
        </div>
        <button
          onClick={runDailySearch}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          {loading
            ? <><Loader2 size={13} className="animate-spin" /> {progress}</>
            : <><RefreshCw size={13} /> {fetchedAt ? 'Refresh' : 'Fetch Top 10'}</>}
        </button>
      </div>

      {/* Body */}
      {error && (
        <div className="px-5 py-3 bg-red-400/10 border-b border-red-400/20 text-red-400 text-xs">
          {error}
          {error.includes('subscribed') && ' — make sure you subscribed to JSearch on RapidAPI'}
        </div>
      )}

      {jobs.length === 0 && !loading ? (
        <div className="px-5 py-10 text-center">
          <Star size={28} className="text-[#1e3a5f] mx-auto mb-2" />
          <p className="text-[#a0b8d0] text-sm font-medium mb-1">No daily results yet</p>
          <p className="text-[#4a7aab] text-xs">Click <strong className="text-[#4a9eff]">Fetch Top 10</strong> to pull today&apos;s best matches</p>
        </div>
      ) : (
        <div className="divide-y divide-[#1e3a5f]">
          {jobs.map((job, i) => {
            const isSaved = savedIds.has(job.id) || job.saved;
            const hasLink = job.url && job.url !== '#' && job.url.startsWith('http');
            return (
              <div key={job.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#1e3a5f]/30 transition-colors">
                {/* Rank */}
                <span className="text-[#4a7aab] text-xs font-mono w-5 flex-shrink-0 text-right">
                  {i + 1}
                </span>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-white text-sm font-semibold hover:text-[#4a9eff] transition-colors truncate"
                    >
                      {job.title}
                    </Link>
                  </div>
                  <p className="text-[#8ba8c8] text-xs truncate">
                    {job.company} · {job.location} · <span className="text-[#4a7aab]">{job.remote}</span>
                  </p>
                </div>

                {/* Fit score */}
                <FitScoreBadge score={job.fitScore} size="sm" />

                {/* Apply button */}
                {hasLink ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    Apply <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="w-16 flex-shrink-0" />
                )}

                {/* Save button */}
                <button
                  onClick={() => isSaved ? onUnsave(job.id) : onSave(job)}
                  className="text-[#4a7aab] hover:text-[#4a9eff] transition-colors flex-shrink-0"
                  title={isSaved ? 'Unsave' : 'Save job'}
                >
                  {isSaved
                    ? <BookmarkCheck size={16} className="text-[#4a9eff]" />
                    : <Bookmark size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {jobs.length > 0 && (
        <div className="px-5 py-2.5 border-t border-[#1e3a5f] flex items-center justify-between">
          <p className="text-[#4a7aab] text-xs">Scored against your resume · refreshes every 24h</p>
          <Link href="/jobs" className="text-[#4a9eff] text-xs hover:text-white transition-colors">
            View all matches →
          </Link>
        </div>
      )}
    </div>
  );
}
