'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Bookmark, MapPin, ExternalLink, Trash2, Search } from 'lucide-react';
import { useJobs } from '@/lib/store';
import FitScoreBadge from '@/components/FitScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';
import { JobStatus } from '@/types';

const STATUSES: JobStatus[] = ['New', 'Interested', 'Applied', 'Interviewing', 'Rejected'];

export default function SavedJobsPage() {
  const { jobs, unsaveJob, updateStatus } = useJobs();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<JobStatus | ''>('');
  const [view, setView] = useState<'table' | 'card'>('table');

  const saved = useMemo(() =>
    jobs
      .filter(j => j.saved)
      .filter(j => {
        const q = search.toLowerCase();
        if (q && !j.title.toLowerCase().includes(q) && !j.company.toLowerCase().includes(q)) return false;
        if (filterStatus && j.status !== filterStatus) return false;
        return true;
      })
      .sort((a, b) => b.fitScore - a.fitScore),
    [jobs, search, filterStatus]
  );

  const statusCounts = useMemo(() =>
    STATUSES.reduce((acc, s) => {
      acc[s] = jobs.filter(j => j.saved && j.status === s).length;
      return acc;
    }, {} as Record<JobStatus, number>),
    [jobs]
  );

  return (
    <div>
      <PageHeader
        title="Saved Jobs"
        subtitle={`${saved.length} saved job${saved.length !== 1 ? 's' : ''}`}
      />

      {/* Status pipeline */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
            className={`bg-[#0d1f3c] border rounded-xl p-3 text-center transition-all ${
              filterStatus === s ? 'border-[#2563eb]' : 'border-[#1e3a5f] hover:border-[#2563eb]/50'
            }`}
          >
            <div className="text-2xl font-bold text-white">{statusCounts[s]}</div>
            <StatusBadge status={s} />
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a7aab]" />
          <input
            type="text"
            placeholder="Search saved jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0d1f3c] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb]"
          />
        </div>
        <div className="flex bg-[#0d1f3c] border border-[#1e3a5f] rounded-lg overflow-hidden">
          {(['table', 'card'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                view === v ? 'bg-[#2563eb] text-white' : 'text-[#8ba8c8] hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {saved.length === 0 ? (
        <div className="text-center py-20">
          <Bookmark size={40} className="text-[#1e3a5f] mx-auto mb-3" />
          <p className="text-white font-medium mb-1">No saved jobs</p>
          <p className="text-[#4a7aab] text-sm">
            <Link href="/jobs" className="text-[#4a9eff] hover:underline">Browse job matches</Link> and save ones you&apos;re interested in.
          </p>
        </div>
      ) : view === 'table' ? (
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3a5f] text-[#4a7aab] text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Job Title</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium">Fit</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Posted</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e3a5f]">
              {saved.map(job => (
                <tr key={job.id} className="hover:bg-[#1e3a5f]/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/jobs/${job.id}`} className="text-white font-medium hover:text-[#4a9eff] transition-colors">
                      {job.title}
                    </Link>
                    <div className="text-[#4a7aab] text-xs mt-0.5">{job.department}</div>
                  </td>
                  <td className="px-4 py-3 text-[#a0b8d0]">{job.company}</td>
                  <td className="px-4 py-3 text-[#8ba8c8] hidden md:table-cell">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />{job.location}
                    </span>
                    <span className="text-xs text-[#4a7aab]">{job.remote}</span>
                  </td>
                  <td className="px-4 py-3">
                    <FitScoreBadge score={job.fitScore} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={job.status}
                      onChange={e => updateStatus(job.id, e.target.value as JobStatus)}
                      className="bg-transparent text-xs border border-[#1e3a5f] rounded px-1.5 py-0.5 text-[#a0b8d0] focus:outline-none focus:border-[#2563eb]"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-[#4a7aab] text-xs hidden lg:table-cell">
                    {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/jobs/${job.id}`} className="text-[#4a9eff] hover:text-white transition-colors">
                        <ExternalLink size={15} />
                      </Link>
                      <button
                        onClick={() => unsaveJob(job.id)}
                        className="text-[#4a7aab] hover:text-red-400 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {saved.map(job => (
            <div key={job.id} className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4 hover:border-[#2563eb] transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Link href={`/jobs/${job.id}`} className="text-white font-semibold hover:text-[#4a9eff] transition-colors">{job.title}</Link>
                  <p className="text-[#8ba8c8] text-sm">{job.company} · {job.location}</p>
                </div>
                <FitScoreBadge score={job.fitScore} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <StatusBadge status={job.status} />
                <select
                  value={job.status}
                  onChange={e => updateStatus(job.id, e.target.value as JobStatus)}
                  className="bg-transparent text-xs border border-[#1e3a5f] rounded px-1.5 py-0.5 text-[#a0b8d0] focus:outline-none"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
