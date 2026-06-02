import { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'violet';
}

const colorMap = {
  blue: 'text-[#4a9eff] bg-[#4a9eff]/10',
  green: 'text-emerald-400 bg-emerald-400/10',
  amber: 'text-amber-400 bg-amber-400/10',
  violet: 'text-violet-400 bg-violet-400/10',
};

export default function StatCard({ label, value, icon: Icon, trend, color = 'blue' }: Props) {
  return (
    <div className="bg-[#0d1f3c] border border-[#1e3a5f] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#8ba8c8] text-sm font-medium">{label}</span>
        <div className={`w-9 h-9 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <Icon size={18} className={colorMap[color].split(' ')[0]} />
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      {trend && <div className="text-[#4a7aab] text-xs">{trend}</div>}
    </div>
  );
}
