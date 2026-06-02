export type JobStatus = 'New' | 'Interested' | 'Applied' | 'Interviewing' | 'Rejected';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: 'Remote' | 'Hybrid' | 'On-site';
  postedDate: string;
  salary?: string;
  fitScore: number;
  matchReasons: string[];
  missingKeywords: string[];
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  status: JobStatus;
  url: string;
  department: string;
  experienceLevel: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead';
  saved: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  degree: string;
  graduationDate: string;
  university: string;
  skills: string[];
  targetTitles: string[];
  targetCompanies: string[];
  preferredLocations: string[];
  remotePreference: ('Remote' | 'Hybrid' | 'On-site')[];
  resumeText?: string;
}

export interface DailyReport {
  date: string;
  newJobs: number;
  topMatches: Job[];
  avgFitScore: number;
}
