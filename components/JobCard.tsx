'use client';

import Link from 'next/link';
import { MapPin, Building2, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Job } from '@/types';
import FitScoreBadge from './FitScoreBadge';
import StatusBadge from './StatusBadge';

interface Props {
  job: Job;
  onSave?: (id: string) => void;
  onUnsave?: (id: string) => void;
}

const hasRealUrl = (url: string) => url && url !== '#' && url.startsWith('http');

export default function JobCard({ job, onSave, onUnsave }: Props) {
  return (
    <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5 hover:border-[#2563eb] transition-all hover:shadow-lg hover:shadow-blue-900/20">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.id}`}
            className="text-white font-semibold text-base leading-tight hover:text-[#4a9eff] transition-colors line-clamp-1"
          >
            {job.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-[#8ba8c8] text-sm">
            <Building2 size={14} />
            <span className="font-medium text-[#a0b8d0]">{job.company}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <FitScoreBadge score={job.fitScore} />
          <button
            onClick={() => job.saved ? onUnsave?.(job.id) : onSave?.(job.id)}
            className="text-[#4a7aab] hover:text-[#4a9eff] transition-colors"
            aria-label={job.saved ? 'Unsave job' : 'Save job'}
          >
            {job.saved ? (
              <BookmarkCheck size={18} className="text-[#4a9eff]" />
            ) : (
              <Bookmark size={18} />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#8ba8c8] text-xs mb-3">
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {job.location}
        </span>
        <span className="px-1.5 py-0.5 bg-[#1e3a5f] rounded text-[#a0b8d0]">{job.remote}</span>
        <span className="px-1.5 py-0.5 bg-[#1e3a5f] rounded text-[#a0b8d0]">{job.experienceLevel}</span>
        {job.salary && <span className="text-[#4a9eff] font-medium">{job.salary}</span>}
      </div>

      <div className="mb-3">
        <p className="text-[#8ba8c8] text-xs line-clamp-2">{job.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.requiredSkills.slice(0, 4).map(skill => (
          <span key={skill} className="px-2 py-0.5 bg-[#1e3a5f] border border-[#2563eb]/30 rounded text-[#4a9eff] text-xs">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <StatusBadge status={job.status} />
        <div className="flex items-center gap-3">
          <span className="text-[#4a7aab] text-xs">
            {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <Link
            href={`/jobs/${job.id}`}
            className="flex items-center gap-1 text-xs text-[#4a7aab] hover:text-[#4a9eff] transition-colors font-medium"
          >
            Details
          </Link>
          {hasRealUrl(job.url) && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-[#4a9eff] hover:text-white transition-colors border border-[#2563eb]/40 hover:border-[#2563eb] px-2 py-0.5 rounded"
            >
              Apply <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
