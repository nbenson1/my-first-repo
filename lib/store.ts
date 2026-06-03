'use client';

import { useState, useEffect } from 'react';
import { Job, UserProfile } from '@/types';
import { defaultUserProfile } from './data';

const JOBS_KEY = 'jobfit_saved_jobs_v2';
const PROFILE_KEY = 'jobfit_profile';

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(JOBS_KEY);
    setJobs(stored ? JSON.parse(stored) : []);
  }, []);

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => {
      const updated = prev.map(j => j.id === id ? { ...j, ...updates } : j);
      localStorage.setItem(JOBS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Persist a brand-new job (e.g. from live search) into saved list
  const addJob = (job: Job) => {
    setJobs(prev => {
      if (prev.find(j => j.id === job.id)) return prev;
      const updated = [...prev, { ...job, saved: true }];
      localStorage.setItem(JOBS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const saveJob = (id: string) => updateJob(id, { saved: true });
  const unsaveJob = (id: string) => updateJob(id, { saved: false });
  const updateStatus = (id: string, status: Job['status']) => updateJob(id, { status });

  return { jobs, updateJob, addJob, saveJob, unsaveJob, updateStatus };
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { profile, updateProfile };
}
