'use client';

import { useState } from 'react';
import { Plus, X, Save, MapPin, Building2, Briefcase, Code } from 'lucide-react';
import { useProfile } from '@/lib/store';
import PageHeader from '@/components/PageHeader';

function TagInput({
  label,
  values,
  onAdd,
  onRemove,
  placeholder,
  icon: Icon,
}: {
  label: string;
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
  placeholder: string;
  icon: React.ElementType;
}) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const v = input.trim();
    if (v && !values.includes(v)) {
      onAdd(v);
      setInput('');
    }
  };

  return (
    <div>
      <label className="flex items-center gap-2 text-[#8ba8c8] text-sm font-medium mb-2">
        <Icon size={14} className="text-[#4a9eff]" />
        {label}
      </label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-white placeholder-[#4a7aab] focus:outline-none focus:border-[#2563eb]"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {values.map(v => (
          <span
            key={v}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1e3a5f] border border-[#2563eb]/30 rounded-full text-xs text-[#a0b8d0]"
          >
            {v}
            <button onClick={() => onRemove(v)} className="text-[#4a7aab] hover:text-red-400 transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PreferencesPage() {
  const { profile, updateProfile } = useProfile();
  const [saved, setSaved] = useState(false);

  const addItem = (field: keyof typeof profile, val: string) => {
    const arr = profile[field] as string[];
    updateProfile({ [field]: [...arr, val] });
  };

  const removeItem = (field: keyof typeof profile, val: string) => {
    const arr = profile[field] as string[];
    updateProfile({ [field]: arr.filter((v: string) => v !== val) });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Job Preferences"
        subtitle="Configure your target roles, locations, and companies"
        action={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Preferences'}
          </button>
        }
      />

      <div className="space-y-6">
        {/* Profile basics */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Email', key: 'email' },
              { label: 'Degree', key: 'degree' },
              { label: 'University', key: 'university' },
              { label: 'Graduation Date', key: 'graduationDate' },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="text-[#8ba8c8] text-xs font-medium block mb-1.5">{label}</label>
                <input
                  type="text"
                  value={(profile as unknown as Record<string, string>)[key] || ''}
                  onChange={e => updateProfile({ [key]: e.target.value })}
                  className="w-full px-3 py-2 bg-[#060f1e] border border-[#1e3a5f] rounded-lg text-sm text-white focus:outline-none focus:border-[#2563eb]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <TagInput
            label="Preferred Locations"
            values={profile.preferredLocations}
            onAdd={v => addItem('preferredLocations', v)}
            onRemove={v => removeItem('preferredLocations', v)}
            placeholder="e.g. Cedar Rapids, IA"
            icon={MapPin}
          />
        </div>

        {/* Target companies */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <TagInput
            label="Target Companies"
            values={profile.targetCompanies}
            onAdd={v => addItem('targetCompanies', v)}
            onRemove={v => removeItem('targetCompanies', v)}
            placeholder="e.g. Collins Aerospace"
            icon={Building2}
          />
        </div>

        {/* Target job titles */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <TagInput
            label="Target Job Titles"
            values={profile.targetTitles}
            onAdd={v => addItem('targetTitles', v)}
            onRemove={v => removeItem('targetTitles', v)}
            placeholder="e.g. Systems Engineer"
            icon={Briefcase}
          />
        </div>

        {/* Skills */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <TagInput
            label="Your Skills"
            values={profile.skills}
            onAdd={v => addItem('skills', v)}
            onRemove={v => removeItem('skills', v)}
            placeholder="e.g. SolidWorks"
            icon={Code}
          />
        </div>

        {/* Remote preference */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4">Work Arrangement</h2>
          <div className="flex gap-3">
            {(['Remote', 'Hybrid', 'On-site'] as const).map(opt => {
              const active = profile.remotePreference.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => {
                    const current = profile.remotePreference;
                    updateProfile({
                      remotePreference: active
                        ? current.filter(v => v !== opt)
                        : [...current, opt],
                    });
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    active
                      ? 'bg-[#2563eb]/20 border-[#2563eb] text-[#4a9eff]'
                      : 'bg-[#060f1e] border-[#1e3a5f] text-[#8ba8c8] hover:border-[#2563eb]/50'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
