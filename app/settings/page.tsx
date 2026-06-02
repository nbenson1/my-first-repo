'use client';

import { useState } from 'react';
import { Bell, Clock, Shield, Trash2, Save, RefreshCw, Mail, Database } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        checked ? 'bg-[#2563eb]' : 'bg-[#1e3a5f]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-[#1e3a5f] last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-[#4a7aab] text-xs mt-0.5">{description}</p>}
      </div>
      <div className="ml-4 flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    dailyScan: true,
    emailReport: true,
    emailTime: '07:00',
    minFitScore: 70,
    autoSaveHighFit: true,
    notifyNew: true,
    notifyInterview: true,
    requireApproval: true,
    darkMode: true,
  });

  const [saved, setSaved] = useState(false);

  const set = (key: keyof typeof settings, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Settings"
        subtitle="Configure job scanning, notifications, and application behavior"
        action={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Save size={15} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        }
      />

      <div className="space-y-5">
        {/* Job scanning */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Clock size={15} className="text-[#4a9eff]" /> Job Scanning
          </h2>
          <p className="text-[#4a7aab] text-xs mb-4">Control how and when JobFit AI scans for new jobs</p>

          <SettingRow label="Daily Scan" description="Automatically scan for new jobs every morning">
            <Toggle checked={settings.dailyScan} onChange={v => set('dailyScan', v)} />
          </SettingRow>

          <SettingRow label="Minimum Fit Score" description={`Only show jobs with fit score ≥ ${settings.minFitScore}%`}>
            <div className="flex items-center gap-3">
              <input
                type="range" min="50" max="95" step="5"
                value={settings.minFitScore}
                onChange={e => set('minFitScore', Number(e.target.value))}
                className="w-24"
              />
              <span className="text-[#4a9eff] text-sm font-mono w-8">{settings.minFitScore}%</span>
            </div>
          </SettingRow>

          <SettingRow label="Auto-Save High Fit Jobs" description="Automatically save jobs with fit score ≥ 90%">
            <Toggle checked={settings.autoSaveHighFit} onChange={v => set('autoSaveHighFit', v)} />
          </SettingRow>
        </div>

        {/* Notifications */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Bell size={15} className="text-[#4a9eff]" /> Notifications
          </h2>
          <p className="text-[#4a7aab] text-xs mb-4">Choose when and how to receive updates</p>

          <SettingRow label="Daily Email Report" description="Receive a summary of new job matches every morning">
            <Toggle checked={settings.emailReport} onChange={v => set('emailReport', v)} />
          </SettingRow>

          {settings.emailReport && (
            <SettingRow label="Report Time" description="When to send the daily email">
              <input
                type="time"
                value={settings.emailTime}
                onChange={e => set('emailTime', e.target.value)}
                className="px-2 py-1 bg-[#060f1e] border border-[#1e3a5f] rounded text-sm text-white focus:outline-none focus:border-[#2563eb]"
              />
            </SettingRow>
          )}

          <SettingRow label="New Job Alerts" description="Get notified when new high-fit jobs are found">
            <Toggle checked={settings.notifyNew} onChange={v => set('notifyNew', v)} />
          </SettingRow>

          <SettingRow label="Interview Reminders" description="Reminders for jobs in Interview stage">
            <Toggle checked={settings.notifyInterview} onChange={v => set('notifyInterview', v)} />
          </SettingRow>
        </div>

        {/* Application safety */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Shield size={15} className="text-emerald-400" /> Application Safety
          </h2>
          <p className="text-[#4a7aab] text-xs mb-4">Controls for application submission behavior</p>

          <SettingRow label="Require Manual Approval" description="You must confirm before any application is submitted">
            <Toggle checked={settings.requireApproval} onChange={v => set('requireApproval', v)} />
          </SettingRow>

          <div className="mt-3 bg-emerald-400/10 border border-emerald-400/20 rounded-lg p-3">
            <p className="text-emerald-400 text-xs font-semibold mb-1">Always On</p>
            <p className="text-[#a0b8d0] text-xs">
              JobFit AI will <strong className="text-white">never</strong> auto-submit applications without your explicit confirmation. This is a core safety guarantee.
            </p>
          </div>
        </div>

        {/* Integrations (future) */}
        <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
          <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
            <Database size={15} className="text-[#4a9eff]" /> Integrations <span className="text-xs text-[#4a7aab] font-normal ml-1">(coming soon)</span>
          </h2>
          <p className="text-[#4a7aab] text-xs mb-4">Connect external job boards and AI services</p>
          {[
            { name: 'LinkedIn Jobs API', icon: '🔗', status: 'Not connected' },
            { name: 'Indeed API', icon: '🔍', status: 'Not connected' },
            { name: 'OpenAI / Claude AI', icon: '🤖', status: 'Not connected' },
            { name: 'Email (SMTP)', icon: '📧', status: 'Not connected' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between py-2.5 border-b border-[#1e3a5f] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-[#a0b8d0] text-sm">{item.name}</span>
              </div>
              <button className="px-3 py-1 bg-[#1e3a5f] hover:bg-[#2563eb]/20 border border-[#2563eb]/30 text-[#4a9eff] text-xs rounded-lg transition-colors">
                Connect
              </button>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div className="bg-[#0d1f3c] border border-red-400/20 rounded-xl p-5">
          <h2 className="text-red-400 font-semibold mb-1 flex items-center gap-2">
            <Trash2 size={15} /> Danger Zone
          </h2>
          <p className="text-[#4a7aab] text-xs mb-4">Irreversible actions</p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f] hover:bg-red-400/10 border border-[#1e3a5f] hover:border-red-400/30 text-[#8ba8c8] hover:text-red-400 rounded-lg text-sm transition-colors">
              <RefreshCw size={14} /> Reset Job Data
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f] hover:bg-red-400/10 border border-[#1e3a5f] hover:border-red-400/30 text-[#8ba8c8] hover:text-red-400 rounded-lg text-sm transition-colors">
              <Trash2 size={14} /> Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
