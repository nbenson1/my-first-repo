'use client';

import { useState } from 'react';
import { Upload, FileText, Wand2, CheckCircle, Download, Eye } from 'lucide-react';
import { useJobs } from '@/lib/store';
import { useProfile } from '@/lib/store';
import { RESUME_TEXT } from '@/lib/data';
import FitScoreBadge from '@/components/FitScoreBadge';
import PageHeader from '@/components/PageHeader';

function buildTailoredResume(jobTitle: string, company: string, requiredSkills: string[], preferredSkills: string[]): string {
  const allKeywords = [...requiredSkills, ...preferredSkills].slice(0, 5).join(', ');
  return `Nolan A. Benson
(815)-761-3406 | nbenson1@iastate.edu

PERSONAL STATEMENT
Aerospace Engineering student at Iowa State University with direct experience in avionics manufacturing, CAD modeling, GD&T, NDE, and cross-functional team collaboration. Targeting ${jobTitle} roles at ${company} where I can apply manufacturing, quality, and systems-level skills to high-impact aerospace programs.

EDUCATION
Iowa State University — Aug 2021 – Dec 2026
B.S. Aerospace Engineering | Minor: Nondestructive Evaluation — Ames, Iowa
GPA: 2.98/4.00 | Dean's List (Spring 2022, Spring 2026) | Journey & Expedition Scholarship Awards

RELEVANT WORK EXPERIENCE

Collins Aerospace — Jan 2024 – Aug 2024
Industrial Engineer Co-op | Avionics Manufacturing — Bellevue, Iowa
• Collaborated with engineering, manufacturing, and quality teams to document and improve avionics manufacturing processes in a regulated AS9100 aerospace environment — directly applicable to ${allKeywords}.
• Designed and modified 3D models and production layouts in SOLIDWORKS to support tooling, fixtures, machine guarding, and continuous avionics production flow.
• Managed design and installation of manufacturing fixtures and safety equipment, ensuring alignment between design intent, GD&T requirements, and shop-floor execution.
• Led rollout of smart torque tooling systems to improve process standardization, assembly traceability, and quality checks — driving measurable reduction in assembly errors.
• Applied GD&T and interpreted engineering drawings to verify manufacturability and interface fit, ensuring compliance with aerospace documentation standards.

Enterpl.ai — May 2025 – Aug 2025
AI Automation Engineering Intern — Remote
• Designed and tested automated system workflows emphasizing reliability, edge-case handling, and predictable behavior — skills transferable to process verification and test validation.
• Verified system performance against functional specifications, refining logic for consistency and repeatability.

ENGINEERING PROJECTS

ARC Aerial Relay Communications — Senior Design Project, 2026
• Created aircraft CAD geometry in Onshape for a fixed-wing sUAS with swappable avionics bay and field-deployable hard-case stowage — constrained design under real structural and volume requirements.
• Contributed structural load path analysis, manufacturability input, and detachable component design for boom/spar layout and fuselage integration.

Composite Manufacturing & Nondestructive Evaluation Testing — 2026
• Fabricated woven fiberglass/epoxy laminates and performed ultrasonic NDE inspection per ASTM D7264 — hands-on experience directly relevant to ${requiredSkills[0] || 'quality inspection'}.
• Evaluated defect types (fiber damage, resin starvation, void inclusions) with inspection data, supporting quantitative failure analysis.

SKILLS
CAD & Design: SOLIDWORKS, Onshape, Creo (exposure), engineering layouts
Engineering: GD&T, structural load paths, manufacturability, avionics integration, NDE fundamentals
Manufacturing: Lean Manufacturing, 5S Methodology, tooling & fixture support, process improvement
Technical Tools: MATLAB, Microsoft Office, CORE`;
}

export default function ResumePage() {
  const { jobs } = useJobs();
  const { profile } = useProfile();
  const [resumeText, setResumeText] = useState(RESUME_TEXT);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [tailored, setTailored] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'tailor'>('upload');

  const savedJobs = jobs.filter(j => j.saved);
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handleGenerate = () => {
    if (!selectedJob) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setTailored(buildTailoredResume(
        selectedJob.title,
        selectedJob.company,
        selectedJob.requiredSkills,
        selectedJob.preferredSkills,
      ));
      setActiveTab('tailor');
    }, 1800);
  };

  return (
    <div>
      <PageHeader
        title="Resume Tailoring"
        subtitle="Your resume is pre-loaded — select a job and generate a tailored version"
      />

      <div className="flex border-b border-[#1e3a5f] mb-6">
        {(['upload', 'tailor'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-[#2563eb] text-[#4a9eff]'
                : 'border-transparent text-[#8ba8c8] hover:text-white'
            }`}
          >
            {tab === 'upload' ? 'Resume & Profile' : 'Tailored Resume'}
          </button>
        ))}
      </div>

      {activeTab === 'upload' ? (
        <div className="max-w-3xl space-y-6">
          {/* Upload area */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <FileText size={16} className="text-[#4a9eff]" />
                Resume Content
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-lg">
                <CheckCircle size={13} className="text-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">Resume loaded from upload</span>
              </div>
            </div>
            <div className="border-2 border-dashed border-[#1e3a5f] hover:border-[#2563eb] rounded-xl p-5 text-center transition-colors cursor-pointer mb-4">
              <Upload size={28} className="text-[#1e3a5f] mx-auto mb-2" />
              <p className="text-[#a0b8d0] text-sm font-medium mb-0.5">Upload a new version</p>
              <p className="text-[#4a7aab] text-xs">Supports PDF, DOCX, TXT</p>
            </div>
            <div>
              <label className="text-[#8ba8c8] text-sm font-medium block mb-2">Current resume text (editable):</label>
              <textarea
                rows={14}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-xs text-[#a0b8d0] placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb] font-mono resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Target job selector */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Wand2 size={16} className="text-violet-400" />
              Tailor for a Specific Job
            </h2>
            <div className="mb-4">
              <label className="text-[#8ba8c8] text-sm font-medium block mb-2">Select a saved job:</label>
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-[#2563eb]"
              >
                <option value="">Choose a saved job...</option>
                {savedJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} – {j.company} ({j.fitScore}% fit)
                  </option>
                ))}
              </select>
              {savedJobs.length === 0 && (
                <p className="text-[#4a7aab] text-xs mt-2">Save some jobs on the Job Matches page first.</p>
              )}
            </div>

            {selectedJob && (
              <div className="bg-[#060f1e] border border-[#1e3a5f] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-white font-medium">{selectedJob.title}</span>
                    <span className="text-[#8ba8c8] text-sm ml-2">@ {selectedJob.company}</span>
                  </div>
                  <FitScoreBadge score={selectedJob.fitScore} size="sm" />
                </div>
                <div className="mb-2">
                  <p className="text-[#4a7aab] text-xs font-semibold uppercase tracking-wider mb-1.5">Required — will be highlighted:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.requiredSkills.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded text-emerald-400 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[#4a7aab] text-xs font-semibold uppercase tracking-wider mb-1.5">Gaps to address:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.missingKeywords.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/20 rounded text-amber-400 text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!selectedJobId || generating}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Wand2 size={15} />
              {generating ? 'Tailoring your resume...' : 'Generate Tailored Resume'}
            </button>
          </div>

          {/* Skills profile */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              Skills Detected from Resume
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map(s => (
                <span key={s} className="px-2.5 py-1 bg-[#1e3a5f] border border-[#2563eb]/20 rounded-full text-[#a0b8d0] text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl">
          {tailored ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-semibold">Tailored Resume</h2>
                  {selectedJob && (
                    <p className="text-[#8ba8c8] text-sm mt-0.5">
                      Optimized for: <span className="text-[#4a9eff]">{selectedJob.title}</span> at {selectedJob.company}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0d1f3c] border border-[#1e3a5f] hover:border-[#2563eb] text-[#a0b8d0] hover:text-white rounded-lg text-sm transition-colors">
                    <Eye size={14} /> Preview
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm transition-colors">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
              <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-6">
                <pre className="text-[#a0b8d0] text-xs leading-relaxed font-mono whitespace-pre-wrap">{tailored}</pre>
              </div>
              {selectedJob && (
                <div className="mt-4 bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4">
                  <h3 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <CheckCircle size={14} /> What Was Optimized
                  </h3>
                  <ul className="space-y-1 text-[#a0b8d0] text-sm">
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />Personal statement reframed toward {selectedJob.title} at {selectedJob.company}</li>
                    {selectedJob.requiredSkills.map(s => (
                      <li key={s} className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                        &quot;{s}&quot; surfaced prominently in relevant bullets
                      </li>
                    ))}
                    <li className="flex items-center gap-2"><CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />Collins co-op bullets reworded to match job description language</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Wand2 size={40} className="text-[#1e3a5f] mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No tailored resume yet</p>
              <p className="text-[#4a7aab] text-sm">
                Go to <button onClick={() => setActiveTab('upload')} className="text-[#4a9eff] hover:underline">Resume &amp; Profile</button> to select a job and generate a tailored version.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
