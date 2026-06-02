'use client';

import { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Building2, Calendar, DollarSign,
  CheckCircle, XCircle, Wand2, FileText, Bookmark,
  BookmarkCheck, ExternalLink, ChevronDown,
} from 'lucide-react';
import { useJobs } from '@/lib/store';
import FitScoreBadge from '@/components/FitScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import { JobStatus } from '@/types';

const STATUSES: JobStatus[] = ['New', 'Interested', 'Applied', 'Interviewing', 'Rejected'];

const MOCK_RESUME_BULLETS = [
  'Designed and analyzed avionics system interfaces using structured requirements documentation and GD&T-compliant technical drawings, reducing design review cycle time by 15%.',
  'Developed MATLAB scripts to automate data analysis pipelines for manufacturing quality metrics, processing 500+ inspection records per shift.',
  'Led 5S Lean initiative on avionics assembly floor, resulting in a 20% reduction in tool retrieval time and a cleaner, auditable workspace.',
  'Performed NDE inspections on composite airframe assemblies, identifying and documenting 12 defects prior to final assembly — zero escapes to customer.',
  'Collaborated with cross-functional NPI team to transition 3 new avionics assemblies from prototype to production, creating work instructions and process FMEAs.',
];

const MOCK_COVER_LETTER = `Dear Hiring Team,

I am writing to express my strong interest in this role at your organization. As an Aerospace Engineering student graduating in December 2026 from Iowa State University, I am eager to apply my academic background and hands-on manufacturing experience to contribute to your team.

During my time in academia and internships, I developed expertise in systems engineering, avionics manufacturing, and technical documentation. I have direct experience with MATLAB, Python, SolidWorks, GD&T, and Lean/5S methodologies — all of which align closely with the requirements of this role.

I am particularly drawn to your focus on [specific program/technology], and I believe my background in avionics manufacturing and NDE positions me well to add immediate value to your team.

I would welcome the opportunity to discuss how my skills and enthusiasm align with your team's needs. Thank you for your consideration.

Sincerely,
Nolan Benson`;

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { jobs, saveJob, unsaveJob, updateStatus } = useJobs();

  const job = useMemo(() => jobs.find(j => j.id === id), [jobs, id]);

  const [showBullets, setShowBullets] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [generating, setGenerating] = useState<'bullets' | 'cover' | null>(null);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <p className="text-white text-lg font-medium mb-2">Job not found</p>
        <button onClick={() => router.back()} className="text-[#4a9eff] text-sm">Go back</button>
      </div>
    );
  }

  const mockGenerate = (type: 'bullets' | 'cover') => {
    setGenerating(type);
    setTimeout(() => {
      setGenerating(null);
      if (type === 'bullets') setShowBullets(true);
      else setShowCoverLetter(true);
    }, 1500);
  };

  const fitColor =
    job.fitScore >= 90 ? 'from-emerald-500/20 to-transparent border-emerald-400/30' :
    job.fitScore >= 75 ? 'from-[#2563eb]/20 to-transparent border-[#2563eb]/30' :
    'from-amber-500/20 to-transparent border-amber-400/30';

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#8ba8c8] hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      {/* Header card */}
      <div className={`bg-gradient-to-r ${fitColor} border rounded-xl p-6 mb-6`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
            <div className="flex items-center gap-2 text-[#a0b8d0]">
              <Building2 size={15} />
              <span className="font-semibold text-white">{job.company}</span>
              <span className="text-[#4a7aab]">·</span>
              <span>{job.department}</span>
            </div>
          </div>
          <FitScoreBadge score={job.fitScore} size="lg" />
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-[#8ba8c8] mb-4">
          <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1e3a5f] rounded">{job.remote}</span>
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1e3a5f] rounded">{job.experienceLevel}</span>
          {job.salary && <span className="flex items-center gap-1.5 text-[#4a9eff] font-medium"><DollarSign size={14} />{job.salary}</span>}
          <span className="flex items-center gap-1.5"><Calendar size={14} />Posted {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#8ba8c8] text-sm">Status:</span>
            <select
              value={job.status}
              onChange={e => updateStatus(job.id, e.target.value as JobStatus)}
              className="px-2 py-1 bg-[#0a1628] border border-[#1e3a5f] rounded text-sm text-white focus:outline-none focus:border-[#2563eb]"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            onClick={() => job.saved ? unsaveJob(job.id) : saveJob(job.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              job.saved
                ? 'bg-[#4a9eff]/10 border-[#4a9eff]/30 text-[#4a9eff]'
                : 'bg-[#1e3a5f] border-[#1e3a5f] text-[#8ba8c8] hover:border-[#4a9eff] hover:text-[#4a9eff]'
            }`}
          >
            {job.saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            {job.saved ? 'Saved' : 'Save Job'}
          </button>
          <a
            href={job.url}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink size={14} /> View Posting
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3">Job Description</h2>
            <p className="text-[#a0b8d0] text-sm leading-relaxed">{job.description}</p>
          </div>

          {/* Match analysis */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4">Match Analysis</h2>
            <div className="space-y-2 mb-5">
              <h3 className="text-emerald-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle size={13} /> Why You Match
              </h3>
              {job.matchReasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[#a0b8d0]">
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {r}
                </div>
              ))}
            </div>
            {job.missingKeywords.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle size={13} /> Gaps to Address
                </h3>
                {job.missingKeywords.map((k, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[#a0b8d0]">
                    <XCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    {k}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume bullets */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Wand2 size={16} className="text-violet-400" />
                Tailored Resume Bullets
              </h2>
              <button
                onClick={() => mockGenerate('bullets')}
                disabled={generating === 'bullets'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/30 text-violet-300 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {generating === 'bullets' ? 'Generating...' : 'Generate Suggestions'}
              </button>
            </div>
            {showBullets ? (
              <div className="space-y-3">
                {MOCK_RESUME_BULLETS.map((b, i) => (
                  <div key={i} className="bg-[#060f1e] border border-[#1e3a5f] rounded-lg p-3 text-sm text-[#a0b8d0] leading-relaxed">
                    • {b}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#4a7aab] text-sm">Click &quot;Generate Suggestions&quot; to get AI-tailored resume bullets for this job.</p>
            )}
          </div>

          {/* Cover letter */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FileText size={16} className="text-[#4a9eff]" />
                Cover Letter / Recruiter Message
              </h2>
              <button
                onClick={() => mockGenerate('cover')}
                disabled={generating === 'cover'}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb]/20 hover:bg-[#2563eb]/30 border border-[#2563eb]/30 text-[#4a9eff] rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                {generating === 'cover' ? 'Generating...' : 'Generate Draft'}
              </button>
            </div>
            {showCoverLetter ? (
              <div className="bg-[#060f1e] border border-[#1e3a5f] rounded-lg p-4 text-sm text-[#a0b8d0] leading-relaxed whitespace-pre-line font-mono text-xs">
                {MOCK_COVER_LETTER}
              </div>
            ) : (
              <p className="text-[#4a7aab] text-sm">Click &quot;Generate Draft&quot; to create a personalized cover letter for this role.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.requiredSkills.map(s => (
                <span key={s} className="px-2 py-1 bg-[#1e3a5f] border border-[#2563eb]/30 rounded text-[#4a9eff] text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Preferred Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {job.preferredSkills.map(s => (
                <span key={s} className="px-2 py-1 bg-[#1e3a5f] rounded text-[#8ba8c8] text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-4">
            <h3 className="text-white font-semibold text-sm mb-3">Fit Score Breakdown</h3>
            {[
              { label: 'Skills Match', val: Math.min(100, job.fitScore + 2) },
              { label: 'Location Match', val: job.location.includes('IA') || job.location.includes('IL') || job.location.includes('MN') ? 100 : 45 },
              { label: 'Title Match', val: Math.min(100, job.fitScore - 5) },
              { label: 'Experience Level', val: job.experienceLevel === 'Entry-Level' ? 100 : 60 },
            ].map(({ label, val }) => (
              <div key={label} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#8ba8c8]">{label}</span>
                  <span className="text-[#4a9eff] font-mono">{val}%</span>
                </div>
                <div className="h-1.5 bg-[#1e3a5f] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${val >= 90 ? 'bg-emerald-400' : val >= 70 ? 'bg-[#2563eb]' : 'bg-amber-400'}`}
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-400/10 border border-amber-400/30 rounded-xl p-4">
            <h3 className="text-amber-400 font-semibold text-sm mb-2">Application Note</h3>
            <p className="text-[#a0b8d0] text-xs leading-relaxed">
              Manual approval required before any application is submitted. Use the status dropdown to track your progress. JobFit AI will never auto-submit applications without your confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
