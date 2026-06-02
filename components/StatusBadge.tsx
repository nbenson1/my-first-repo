import { JobStatus } from '@/types';

interface Props {
  status: JobStatus;
}

const statusStyles: Record<JobStatus, string> = {
  New: 'text-[#4a9eff] bg-[#4a9eff]/10 border-[#4a9eff]/30',
  Interested: 'text-violet-400 bg-violet-400/10 border-violet-400/30',
  Applied: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  Interviewing: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  Rejected: 'text-red-400 bg-red-400/10 border-red-400/30',
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-md border text-xs font-semibold px-2 py-0.5 ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
