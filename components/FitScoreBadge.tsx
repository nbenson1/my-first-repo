interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function FitScoreBadge({ score, size = 'md' }: Props) {
  const color =
    score >= 90 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' :
    score >= 75 ? 'text-[#4a9eff] bg-[#4a9eff]/10 border-[#4a9eff]/30' :
    score >= 60 ? 'text-amber-400 bg-amber-400/10 border-amber-400/30' :
    'text-red-400 bg-red-400/10 border-red-400/30';

  const sizeClass =
    size === 'sm' ? 'text-xs px-2 py-0.5' :
    size === 'lg' ? 'text-2xl px-4 py-2 font-bold' :
    'text-sm px-2.5 py-1 font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-md border ${color} ${sizeClass} font-mono`}>
      {score}%
    </span>
  );
}
