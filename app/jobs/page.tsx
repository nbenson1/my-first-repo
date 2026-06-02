'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useJobs } from '@/lib/store';
import JobCard from '@/components/JobCard';
import PageHeader from '@/components/PageHeader';
import { Job, JobStatus } from '@/types';

const STATUSES: JobStatus[] = ['New', 'Interested', 'Applied', 'Interviewing', 'Rejected'];
const REMOTE_OPTS = ['Remote', 'Hybrid', 'On-site'];

export default function JobsPage() {
  const { jobs, saveJob, unsaveJob } = useJobs();
  const [search, setSearch] = useState('');
  const [minFit, setMinFit] = useState(0);
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');
  const [filterRemote, setFilterRemote] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [sortBy, setSortBy] = useState<'fitScore' | 'postedDate'>('fitScore');
  const [showFilters, setShowFilters] = useState(false);

  const companies = useMemo(() => [...new Set(jobs.map(j => j.company))].sort(), [jobs]);

  const filtered = useMemo(() => {
    return jobs
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
  }, [jobs, search, minFit, filterStatus, filterRemote, filterCompany, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setMinFit(0);
    setFilterStatus('');
    setFilterRemote('');
    setFilterCompany('');
  };

  const activeFilters = [filterStatus, filterRemote, filterCompany].filter(Boolean).length + (minFit > 0 ? 1 : 0);

  return (
    <div>
      <PageHeader
        title="Job Matches"
        subtitle={`${filtered.length} jobs found matching your profile`}
      />

      {/* Search + controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7aab]" />
          <input
            type="text"
            placeholder="Search jobs, companies, locations..."
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

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as JobStatus | '')}
              className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]"
            >
              <option value="">All statuses</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Work Type</label>
            <select
              value={filterRemote}
              onChange={e => setFilterRemote(e.target.value)}
              className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]"
            >
              <option value="">All types</option>
              {REMOTE_OPTS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">Company</label>
            <select
              value={filterCompany}
              onChange={e => setFilterCompany(e.target.value)}
              className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]"
            >
              <option value="">All companies</option>
              {companies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">
              Min Fit Score: <span className="text-[#4a9eff]">{minFit}%</span>
            </label>
            <input
              type="range" min="0" max="100" step="5"
              value={minFit}
              onChange={e => setMinFit(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Job grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#4a7aab]">
          <p className="text-lg font-medium text-white mb-1">No jobs match your filters</p>
          <p className="text-sm">Try adjusting your search or clearing filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onSave={saveJob} onUnsave={unsaveJob} />
          ))}
        </div>
      )}
    </div>
  );
}
