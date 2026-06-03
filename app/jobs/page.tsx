'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Zap, Loader2, AlertCircle, Radio } from 'lucide-react';
import { useJobs } from '@/lib/store';
import { fetchLiveJobs, SEARCH_PRESETS } from '@/lib/jobSearch';
import JobCard from '@/components/JobCard';
import PageHeader from '@/components/PageHeader';
import { Job, JobStatus } from '@/types';

const STATUSES: JobStatus[] = ['New', 'Interested', 'Applied', 'Interviewing', 'Rejected'];
const REMOTE_OPTS = ['Remote', 'Hybrid', 'On-site'];

export default function JobsPage() {
  const { jobs: savedJobs, addJob, unsaveJob } = useJobs();

  // Live search state
  const [liveJobs, setLiveJobs] = useState<Job[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selectedPresets, setSelectedPresets] = useState<Set<number>>(new Set());
  const [customQuery, setCustomQuery] = useState('');
  const [lastSearched, setLastSearched] = useState('');
  const [showLiveSearch, setShowLiveSearch] = useState(true);

  // Filter state
  const [search, setSearch] = useState('');
  const [minFit, setMinFit] = useState(0);
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');
  const [filterRemote, setFilterRemote] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortBy, setSortBy] = useState<'fitScore' | 'postedDate'>('fitScore');
  const [showFilters, setShowFilters] = useState(false);

  // Merge live results with saved jobs, mark already-saved ones
  const savedIds = useMemo(() => new Set(savedJobs.map(j => j.id)), [savedJobs]);

  const allJobs = useMemo(() => {
    const seen = new Set<string>();
    const merged = [
      ...savedJobs,
      ...liveJobs.filter(lj => {
        if (savedIds.has(lj.id)) return false;
        const key = `${lj.company}|${lj.title}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }),
    ];
    return merged.map(j => ({ ...j, saved: savedIds.has(j.id) }));
  }, [liveJobs, savedJobs, savedIds]);

  const companies = useMemo(() => [...new Set(allJobs.map(j => j.company))].sort(), [allJobs]);

  const filtered = useMemo(() => {
    return allJobs
      .filter(j => {
        const q = search.toLowerCase();
        if (q && !j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q) && !j.location.toLowerCase().includes(q)) return false;
        if (j.fitScore < minFit) return false;
        if (filterStatus && j.status !== filterStatus) return false;
        if (filterRemote && j.remote !== filterRemote) return false;
        if (filterCompany && j.company !== filterCompany) return false;
        return true;
      })
      .sort((a, b) =>
        sortBy === 'fitScore'
          ? b.fitScore - a.fitScore
          : new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      );
  }, [allJobs, search, minFit, filterStatus, filterRemote, filterCompany, sortBy]);

  const clearFilters = () => {
    setSearch(''); setMinFit(0); setFilterStatus(''); setFilterRemote(''); setFilterCompany('');
  };

  const activeFilters = [filterStatus, filterRemote, filterCompany].filter(Boolean).length + (minFit > 0 ? 1 : 0);

  const togglePreset = (i: number) => {
    setSelectedPresets(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
    setCustomQuery('');
  };

  const handleSearch = async () => {
    const queries = customQuery.trim()
      ? [customQuery.trim()]
      : selectedPresets.size > 0
      ? [...selectedPresets].map(i => SEARCH_PRESETS[i].query)
      : [SEARCH_PRESETS[0].query];

    setSearching(true);
    setSearchError('');
    setLastSearched(queries.length === 1 ? queries[0] : `${queries.length} searches`);

    let allResults: Job[] = [];
    for (let i = 0; i < queries.length; i++) {
      setSearchProgress(`Searching ${i + 1} of ${queries.length}...`);
      const { jobs: results, error } = await fetchLiveJobs(queries[i]);
      if (error) {
        setSearching(false);
        setSearchProgress('');
        setSearchError(error);
        return;
      }
      allResults = [...allResults, ...results];
    }

    setSearching(false);
    setSearchProgress('');
    setLiveJobs(prev => {
      const newIds = new Set(allResults.map(j => j.id));
      const kept = prev.filter(j => !newIds.has(j.id));
      const seen = new Set<string>();
      const deduped = allResults.filter(j => {
        const key = `${j.company}|${j.title}`.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      return [...kept, ...deduped];
    });
  };

  const handleSave = (id: string) => {
    const job = allJobs.find(j => j.id === id);
    if (job) addJob(job);
  };

  const handleUnsave = (id: string) => {
    unsaveJob(id);
  };

  return (
    <div>
      <PageHeader
        title="Job Matches"
        subtitle="Search live job boards and see how well each role fits your profile"
      />

      {/* Live Search Panel */}
      <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl mb-6 overflow-hidden">
        <button
          onClick={() => setShowLiveSearch(!showLiveSearch)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1e3a5f]/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb]/20 flex items-center justify-center">
              <Radio size={15} className="text-[#4a9eff]" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold text-sm">Live Job Search</p>
              <p className="text-[#4a7aab] text-xs">
                {lastSearched
                  ? `Last searched: "${lastSearched}" — ${liveJobs.length} results`
                  : 'Pull real-time postings from LinkedIn, Indeed, Glassdoor & more'}
              </p>
            </div>
          </div>
          <span className="text-[#4a7aab] text-xs">{showLiveSearch ? '▲ collapse' : '▼ expand'}</span>
        </button>

        {showLiveSearch && (
          <div className="px-5 pb-5 border-t border-[#1e3a5f] pt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[#8ba8c8] text-xs font-medium">
                  Select one or more presets — then click Search:
                  {selectedPresets.size > 0 && (
                    <span className="ml-2 text-[#4a9eff]">{selectedPresets.size} selected</span>
                  )}
                </label>
                {selectedPresets.size > 0 && (
                  <button onClick={() => setSelectedPresets(new Set())} className="text-xs text-[#4a7aab] hover:text-white transition-colors">
                    Clear selection
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {SEARCH_PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => togglePreset(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedPresets.has(i) && !customQuery
                        ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#4a9eff]'
                        : 'bg-[#060f1e] border-[#1e3a5f] text-[#8ba8c8] hover:border-[#2563eb]/50 hover:text-white'
                    }`}
                  >
                    {selectedPresets.has(i) && !customQuery && <span className="mr-1">✓</span>}
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Or type your own search... e.g. 'NDE quality engineer Cedar Rapids'"
                className="flex-1 px-3 py-2.5 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb]"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-60 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {searching
                  ? <><Loader2 size={15} className="animate-spin" /> {searchProgress || 'Searching...'}</>
                  : <><Zap size={15} /> Search{selectedPresets.size > 1 ? ` (${selectedPresets.size})` : ''}</>}
              </button>
            </div>

            {searchError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-400/10 border border-red-400/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={15} />
                {searchError}
              </div>
            )}

            {liveJobs.length > 0 && (
              <p className="text-[#4a7aab] text-xs">
                {liveJobs.length} results · scored against your resume ·{' '}
                <button onClick={() => { setLiveJobs([]); setLastSearched(''); }} className="text-red-400 hover:underline">
                  Clear
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7aab]" />
          <input
            type="text"
            placeholder="Filter by title, company, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0d1f3c] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb]"
          />
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 bg-[#0d1f3c] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]"
        >
          <option value="fitScore">Sort: Fit Score</option>
          <option value="postedDate">Sort: Newest</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg text-sm font-medium transition-colors ${
            showFilters || activeFilters > 0
              ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#4a9eff]'
              : 'bg-[#0d1f3c] border-[#1e3a5f] text-[#a0b8d0] hover:border-[#2563eb]'
          }`}
        >
          <SlidersHorizontal size={15} />
          Filters {activeFilters > 0 && `(${activeFilters})`}
        </button>
        {activeFilters > 0 && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-[#4a7aab] hover:text-white transition-colors">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as JobStatus | '')} className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]">
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Work Type</label>
            <select value={filterRemote} onChange={e => setFilterRemote(e.target.value)} className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]">
              <option value="">All types</option>
              {REMOTE_OPTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Company</label>
            <select value={filterCompany} onChange={e => setFilterCompany(e.target.value)} className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]">
              <option value="">All companies</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Min Fit Score: <span className="text-[#4a9eff]">{minFit}%</span></label>
            <input type="range" min="0" max="100" step="5" value={minFit} onChange={e => setMinFit(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      )}

      {/* Results */}
      {liveJobs.length === 0 && savedJobs.length === 0 && !searching ? (
        <div className="text-center py-20 border border-dashed border-[#1e3a5f] rounded-xl">
          <Zap size={36} className="text-[#1e3a5f] mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No jobs yet</p>
          <p className="text-[#4a7aab] text-sm">Pick a preset above and click <strong className="text-[#4a9eff]">Search</strong> to pull real postings.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white font-medium mb-1">No jobs match your filters</p>
          <p className="text-[#4a7aab] text-sm">Try adjusting or clearing filters</p>
        </div>
      ) : (
        <>
          <p className="text-[#4a7aab] text-xs mb-3">
            {filtered.length} job{filtered.length !== 1 ? 's' : ''} · {savedJobs.length} saved
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} onSave={handleSave} onUnsave={handleUnsave} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
