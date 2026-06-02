'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  Briefcase, TrendingUp, Bookmark, CheckCircle,
  RefreshCw, ChevronRight, Calendar, Star,
} from 'lucide-react';
import { useJobs } from '@/lib/store';
import JobCard from '@/components/JobCard';
import StatCard from '@/components/StatCard';
import FitScoreBadge from '@/components/FitScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import PageHeader from '@/components/PageHeader';

export default function Dashboard() {
  const { jobs, saveJob, unsaveJob } = useJobs();

  const stats = useMemo(() => ({
    total: jobs.length,
    newToday: jobs.filter(j => j.status === 'New').length,
    saved: jobs.filter(j => j.saved).length,
    applied: jobs.filter(j => j.status === 'Applied' || j.status === 'Interviewing').length,
    avgFit: Math.round(jobs.reduce((s, j) => s + j.fitScore, 0) / (jobs.length || 1)),
  }), [jobs]);

  const topMatches = useMemo(
    () => [...jobs].sort((a, b) => b.fitScore - a.fitScore).slice(0, 3),
    [jobs]
  );

  const recentActivity = useMemo(
    () => [...jobs]
      .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
      .slice(0, 5),
    [jobs]
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Today's job search overview – June 2, 2026"
        action={
          <button className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors">
            <RefreshCw size={15} />
            Refresh Jobs
          </button>
        }
      />

      <div className="bg-gradient-to-r from-[#0d2a52] to-[#0d1f3c] border border-[#2563eb]/40 rounded-xl p-5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb]/20 flex items-center justify-center">
            <Calendar size={20} className="text-[#4a9eff]" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Daily Report – June 2, 2026</h2>
            <p className="text-[#8ba8c8] text-sm mt-0.5">
              <span className="text-[#4a9eff] font-semibold">12 new jobs</span> found across 7 companies ·{' '}
              Top match: <span className="text-emerald-400 font-semibold">Collins Aerospace (96% fit)</span>
            </p>
          </div>
        </div>
        <Link
          href="/jobs"
          className="flex items-center gap-1 text-sm text-[#4a9eff] hover:text-white transition-colors font-medium"
        >
          View all <ChevronRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Matches" value={stats.total} icon={Briefcase} trend="+12 since yesterday" color="blue" />
        <StatCard label="Avg Fit Score" value={`${stats.avgFit}%`} icon={TrendingUp} trend="Above 80% target" color="green" />
        <StatCard label="Saved Jobs" value={stats.saved} icon={Bookmark} trend={`${stats.applied} in progress`} color="violet" />
        <StatCard label="Applications" value={stats.applied} icon={CheckCircle} trend="1 interviewing" color="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Star size={16} className="text-[#4a9eff]" />
              Top Matches Today
            </h2>
            <Link href="/jobs" className="text-[#4a9eff] text-sm hover:text-white transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {topMatches.map(job => (
              <JobCard key={job.id} job={job} onSave={saveJob} onUnsave={unsaveJob} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl divide-y divide-[#1e3a5f]">
              {recentActivity.map(job => (
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

          <div>
            <h2 className="text-white font-semibold mb-4">Target Companies</h2>
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
