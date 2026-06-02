'use client';

import { useState } from 'react';
import { Upload, FileText, Wand2, CheckCircle, Download, Eye } from 'lucide-react';
import { useJobs } from '@/lib/store';
import { useProfile } from '@/lib/store';
import FitScoreBadge from '@/components/FitScoreBadge';
import PageHeader from '@/components/PageHeader';

const MOCK_TAILORED_RESUME = `NOLAN BENSON
Aerospace Engineering Student | Cedar Rapids, IA | nolanbenson24@gmail.com

EDUCATION
B.S. Aerospace Engineering — Iowa State University — December 2026
Relevant coursework: Flight Mechanics, Structural Analysis, Propulsion Systems, Control Systems

SKILLS
CAD/Modeling: SolidWorks, Onshape, KeyShot
Programming: MATLAB, Python, Excel/VBA
Manufacturing: GD&T, Lean/5S, NDE, Process Documentation
Domain: Avionics Manufacturing, Systems Engineering, Technical Documentation

EXPERIENCE

Avionics Manufacturing Intern — [Company Name] — Summer 2025
• Supported NPI process for avionics LRU assemblies; created work instructions reviewed by 4 engineers
• Performed NDE inspections on 200+ composite assemblies with zero customer escapes
• Implemented 5S improvements reducing tool retrieval time by 20%

Engineering Project — Iowa State University — 2024–2025
• Led systems-level analysis of UAV flight control architecture using MATLAB simulation
• Developed Python script to process 500+ rows of test data; automated weekly reporting
• Produced GD&T-compliant engineering drawings reviewed in formal design review

PROJECTS
• CubeSat Structural Design: SolidWorks model and FEA analysis for 3U CubeSat frame; presented to NASA grant committee
• Flight Controls Simulation: MATLAB/Simulink model of F-16 longitudinal dynamics for coursework`;

export default function ResumePage() {
  const { jobs } = useJobs();
  const { profile } = useProfile();
  const [resumeText, setResumeText] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [generating, setGenerating] = useState(false);
  const [tailored, setTailored] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'tailor'>('upload');

  const savedJobs = jobs.filter(j => j.saved);
  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setTailored(MOCK_TAILORED_RESUME);
      setActiveTab('tailor');
    }, 2000);
  };

  return (
    <div>
      <PageHeader
        title="Resume Tailoring"
        subtitle="Upload your resume and get AI-powered tailored versions for each job"
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
            {tab === 'upload' ? 'Upload & Profile' : 'Tailored Resume'}
          </button>
        ))}
      </div>

      {activeTab === 'upload' ? (
        <div className="max-w-3xl space-y-6">
          {/* Upload area */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Upload size={16} className="text-[#4a9eff]" />
              Resume Upload
            </h2>
            <div className="border-2 border-dashed border-[#1e3a5f] hover:border-[#2563eb] rounded-xl p-8 text-center transition-colors cursor-pointer mb-4">
              <FileText size={36} className="text-[#1e3a5f] mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Drop your resume here or click to upload</p>
              <p className="text-[#4a7aab] text-sm">Supports PDF, DOCX, TXT</p>
            </div>
            <div>
              <label className="text-[#8ba8c8] text-sm font-medium block mb-2">Or paste resume text:</label>
              <textarea
                rows={10}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-[#a0b8d0] placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb] font-mono resize-none"
              />
            </div>
          </div>

          {/* Target job selector */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Wand2 size={16} className="text-violet-400" />
              Tailor for a Job
            </h2>
            <div className="mb-4">
              <label className="text-[#8ba8c8] text-sm font-medium block mb-2">Select a saved job:</label>
              <select
                value={selectedJobId}
                onChange={e => setSelectedJobId(e.target.value)}
                className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-[#2563eb]"
              >
                <option value="">Choose a job...</option>
                {savedJobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title} – {j.company} ({j.fitScore}% fit)
                  </option>
                ))}
              </select>
            </div>

            {selectedJob && (
              <div className="bg-[#060f1e] border border-[#1e3a5f] rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white font-medium">{selectedJob.title}</span>
                    <span className="text-[#8ba8c8] text-sm ml-2">@ {selectedJob.company}</span>
                  </div>
                  <FitScoreBadge score={selectedJob.fitScore} size="sm" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#1e3a5f] rounded text-[#4a9eff] text-xs">{s}</span>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-[#8ba8c8] text-xs font-medium mb-1">Keywords to highlight:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...selectedJob.requiredSkills, ...selectedJob.preferredSkills].slice(0, 6).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-emerald-400/10 border border-emerald-400/20 rounded text-emerald-400 text-xs">{s}</span>
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
              {generating ? 'Tailoring Resume...' : 'Generate Tailored Resume'}
            </button>
          </div>

          {/* Profile skills summary */}
          <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
            <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400" />
              Your Skills Profile
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
                <pre className="text-[#a0b8d0] text-sm leading-relaxed font-mono whitespace-pre-wrap">{tailored}</pre>
              </div>
              {selectedJob && (
                <div className="mt-4 bg-emerald-400/10 border border-emerald-400/20 rounded-xl p-4">
                  <h3 className="text-emerald-400 font-semibold text-sm mb-2 flex items-center gap-1.5">
                    <CheckCircle size={14} /> Optimization Applied
                  </h3>
                  <ul className="space-y-1 text-[#a0b8d0] text-sm">
                    {selectedJob.requiredSkills.map(s => (
                      <li key={s} className="flex items-center gap-2">
                        <CheckCircle size={12} className="text-emerald-400" />
                        Highlighted &quot;{s}&quot; in relevant experience sections
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Wand2 size={40} className="text-[#1e3a5f] mx-auto mb-3" />
              <p className="text-white font-medium mb-1">No tailored resume yet</p>
              <p className="text-[#4a7aab] text-sm">
                Go to the <button onClick={() => setActiveTab('upload')} className="text-[#4a9eff] hover:underline">Upload tab</button> to select a job and generate a tailored resume.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
