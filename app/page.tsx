'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, TrendingUp, Bookmark, CheckCircle, ChevronRight, Calendar,
} from 'lucide-react';
import { useJobs } from '@/lib/store';
import StatCard from '@/components/StatCard';
import FitScoreBadge from '@/components/FitScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';
import DailyTopJobs from '@/components/DailyTopJobs';

export default function Dashboard() {
  const { jobs, addJob, unsaveJob } = useJobs();

  const stats = useMemo(() => ({
    total: jobs.length,
    saved: jobs.filter(j => j.saved).length,
    applied: jobs.filter(j => j.status === 'Applied' || j.status === 'Interviewing').length,
    avgFit: Math.round(jobs.reduce((s, j) => s + j.fitScore, 0) / (jobs.length || 1)),
  }), [jobs]);

  const recentActivity = useMemo(
    () => [...jobs]
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, 6),
    [jobs]
  );

  const savedIds = useMemo(() => new Set(jobs.filter(j => j.saved).map(j => j.id)), [jobs]);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Your daily aerospace job search overview"
      />

      {/* Daily report banner */}
      <div className="bg-gradient-to-r from-[#0d2a52] to-[#0d1f3c] border border-[#2563eb]/40 rounded-xl p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 flex items-center justify-center">
            <Calendar size={20} className="text-[#4a9eff]" />
          </div>
          <div>
            <h2 className="text-white font-semibold">JobFit AI – Aerospace Job Search</h2>
            <p className="text-[#8ba8c8] text-sm mt-0.5">
              Fetch today&apos;s top matches below · Save jobs · Click{' '}
              <span className="text-[#4a9eff] font-semibold">Apply</span> to go directly to the application
            </p>
          </div>
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm text-[#4a9eff] hover:text-white transition-colors font-medium"
        >
          All matches <ChevronRight size={16} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Saved Jobs" value={stats.total} icon={Briefcase} trend="example matches loaded" color="blue" />
        <StatCard label="Avg Fit Score" value={`${stats.avgFit}%`} icon={TrendingUp} trend="vs. your resume" color="green" />
        <StatCard label="Bookmarked" value={stats.saved} icon={Bookmark} trend={`${stats.applied} in progress`} color="violet" />
        <StatCard label="Applications" value={stats.applied} icon={CheckCircle} trend="manual approval only" color="amber" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Daily Top 10 — takes up 2/3 width */}
        <div className="xl:col-span-2">
          <DailyTopJobs onSave={addJob} onUnsave={unsaveJob} savedIds={savedIds} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Recent activity */}
          <div>
            <h2 className="text-white font-semibold mb-3">Saved Jobs Activity</h2>
            <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl divide-y divide-[#1e3a5f]">
              {recentActivity.length === 0 ? (
                <p className="px-4 py-6 text-[#4a7aab] text-sm text-center">No saved jobs yet</p>
              ) : recentActivity.map(job => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#1e3a5f]/40 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{job.title}</p>
                    <p className="text-[#8ba8c8] text-xs">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <FitScoreBadge score={job.fitScore} size="sm" />
                    <StatusBadge status={job.status} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Target companies */}
          <div>
            <h2 className="text-white font-semibold mb-3">Target Companies</h2>
            <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4">
              {['Collins Aerospace', 'Boeing', 'GE Aerospace', 'Honeywell', 'Garmin', 'Lockheed Martin', 'Northrop Grumman', 'Textron'].map(co => {
                const count = jobs.filter(j => j.company === co).length;
                return (
                  <div key={co} className="flex items-center justify-between py-1.5">
                    <span className="text-[#a0b8d0] text-sm">{co}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${count > 0 ? 'text-[#4a9eff] bg-[#4a9eff]/10' : 'text-[#4a7aab] bg-[#1e3a5f]'}`}>
                      {count} job{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
