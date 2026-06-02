import { Job } from '@/types';
import { scoreJob } from './scoring';

// Preset search queries tailored to Nolan's profile
export const SEARCH_PRESETS = [
  { label: 'Avionics / Manufacturing — Iowa & IL', query: 'avionics manufacturing engineer entry level Iowa Illinois' },
  { label: 'Systems Engineer — Midwest', query: 'systems engineer aerospace entry level Iowa Illinois Minnesota' },
  { label: 'NDE / Quality Engineer', query: 'NDE NDT quality engineer aerospace entry level' },
  { label: 'Manufacturing / NPI — All Locations', query: 'manufacturing engineer NPI new product introduction aerospace entry level' },
  { label: 'Collins Aerospace Jobs', query: 'Collins Aerospace engineer entry level' },
  { label: 'GE Aerospace Jobs', query: 'GE Aerospace engineer entry level' },
  { label: 'Boeing New Grad', query: 'Boeing aerospace engineer new graduate entry level' },
  { label: 'Mechanical / Design Engineer — Midwest', query: 'mechanical design engineer aerospace entry level Iowa Illinois Minnesota' },
  { label: 'Test Engineer — Aerospace', query: 'test engineer aerospace entry level new grad' },
  { label: 'Remote Aerospace Engineering', query: 'aerospace engineer remote entry level new grad' },
];

// Raw shape returned by JSearch API
interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city: string;
  job_state: string;
  job_country: string;
  job_is_remote: boolean;
  job_posted_at_datetime_utc: string;
  job_description: string;
  job_apply_link: string;
  job_employment_type: string;
  job_min_salary: number | null;
  job_max_salary: number | null;
  job_salary_currency: string | null;
  job_required_skills: string[] | null;
  job_highlights?: {
    Qualifications?: string[];
    Responsibilities?: string[];
    Benefits?: string[];
  };
}

function formatSalary(min: number | null, max: number | null, currency: string | null): string | undefined {
  if (!min && !max) return undefined;
  const fmt = (n: number) => n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return undefined;
}

function inferExperienceLevel(text: string): Job['experienceLevel'] {
  const t = text.toLowerCase();
  if (t.includes('senior') || t.includes('sr.') || t.includes('lead') || t.includes('principal')) return 'Senior';
  if (t.includes('mid') || t.includes('ii ') || t.includes('level 2')) return 'Mid-Level';
  return 'Entry-Level';
}

export function mapJSearchToJob(raw: JSearchJob): Job {
  const location =
    raw.job_city && raw.job_state
      ? `${raw.job_city}, ${raw.job_state}`
      : raw.job_city || raw.job_state || raw.job_country || 'Unknown';

  const requiredSkills: string[] = raw.job_required_skills ?? [];
  const descriptionShort = (raw.job_description ?? '').slice(0, 600);

  const { score, matchReasons, missingKeywords } = scoreJob(
    raw.job_title,
    raw.employer_name,
    location,
    raw.job_description ?? '',
    requiredSkills,
    raw.job_is_remote,
  );

  const preferredSkills: string[] =
    raw.job_highlights?.Qualifications?.slice(0, 4).map(q => q.replace(/^[-•]\s*/, '').split(' ').slice(0, 4).join(' ')) ?? [];

  return {
    id: `live_${raw.job_id}`,
    title: raw.job_title,
    company: raw.employer_name,
    location,
    remote: raw.job_is_remote ? 'Remote' : 'On-site',
    postedDate: raw.job_posted_at_datetime_utc
      ? raw.job_posted_at_datetime_utc.split('T')[0]
      : new Date().toISOString().split('T')[0],
    salary: formatSalary(raw.job_min_salary, raw.job_max_salary, raw.job_salary_currency),
    fitScore: score,
    matchReasons,
    missingKeywords,
    description: descriptionShort,
    requiredSkills,
    preferredSkills,
    status: 'New',
    url: raw.job_apply_link || '#',
    department: raw.job_employment_type ?? 'Engineering',
    experienceLevel: inferExperienceLevel(raw.job_title + ' ' + (raw.job_description ?? '')),
    saved: false,
  };
}

export async function fetchLiveJobs(query: string): Promise<{ jobs: Job[]; error?: string }> {
  try {
    const res = await fetch(`/api/jobs/search?query=${encodeURIComponent(query)}`);
    const json = await res.json();

    if (!res.ok || json.error) {
      return { jobs: [], error: json.error ?? 'Search failed' };
    }

    const rawJobs: JSearchJob[] = json.data ?? [];
    const jobs = rawJobs.map(mapJSearchToJob);
    return { jobs };
  } catch {
    return { jobs: [], error: 'Network error — check your connection' };
  }
}
