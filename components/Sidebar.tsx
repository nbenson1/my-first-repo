'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Bookmark,
  FileText,
  Settings,
  Zap,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/preferences', label: 'Preferences', icon: Settings },
  { href: '/jobs', label: 'Job Matches', icon: Search },
  { href: '/saved', label: 'Saved Jobs', icon: Bookmark },
  { href: '/resume', label: 'Resume Tailoring', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a1628] border-r border-[#1e3a5f] flex flex-col z-40">
      <div className="px-6 py-5 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">JobFit AI</span>
            <div className="text-[#4a9eff] text-[11px] font-medium tracking-widest uppercase">Aerospace</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-900/30'
                  : 'text-[#8ba8c8] hover:text-white hover:bg-[#1e3a5f]'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#1e3a5f]">
        <div className="bg-[#1e3a5f] rounded-lg p-3">
          <p className="text-[#4a9eff] text-xs font-semibold uppercase tracking-wider mb-1">Last Scan</p>
          <p className="text-white text-sm font-medium">Today, 6:00 AM</p>
          <p className="text-[#8ba8c8] text-xs mt-0.5">12 new matches found</p>
        </div>
      </div>
    </aside>
  );
}
