import { defineStore } from 'pinia';
import axiosInstance from '@/axios';
import { useAuthStore } from './auth';
import { computed } from 'vue';

export interface SkillProgramExercise {
  format: string;
  details: string;
}

export interface SkillProgramSession {
  sessionNumber: number;
  exercises: SkillProgramExercise[];
  progressionNote: string;
  completedAt: string | null;
}

export interface SkillProgramWeek {
  weekNumber: number;
  theme: string;
  sessions: SkillProgramSession[];
}

export interface SkillProgramData {
  overview: string;
  prerequisiteMovements: { movement: string; reason: string }[];
  weeks: SkillProgramWeek[];
  benchmarks: { week: number; test: string }[];
  coachNotes: string[];
}

export interface SavedSkillProgram extends SkillProgramData {
  _id: string;
  movement: string;
  levelTag: string;
  levelDesc: string;
  timing: string;
  weeksCount: number;
  daysPerWeek: number;
  program: SkillProgramWeek[];
  createdAt: string;
}

export const useSkillProgramStore = defineStore('skillProgram', () => {
  const authStore = useAuthStore();
  const userId = computed(() => authStore.userId);

  async function saveSkillProgram(payload: {
    movement: string;
    levelTag: string;
    levelDesc: string;
    timing: string;
    weeks: number;
    daysPerWeek: number;
    overview: string;
    prerequisiteMovements: { movement: string; reason: string }[];
    program: SkillProgramWeek[];
    benchmarks: { week: number; test: string }[];
    coachNotes: string[];
  }) {
    const response = await axiosInstance.post('/skillPrograms', payload);
    return response.data;
  }

  async function getSkillPrograms() {
    const response = await axiosInstance.get(`/skillPrograms/user/${userId.value}`);
    return response.data as SavedSkillProgram[];
  }

  async function getSkillProgram(id: string) {
    const response = await axiosInstance.get(`/skillPrograms/${id}`);
    return response.data as SavedSkillProgram;
  }

  async function markSessionComplete(programId: string, weekNumber: number, sessionNumber: number) {
    await axiosInstance.patch(`/skillPrograms/${programId}/session`, { weekNumber, sessionNumber });
  }

  return { saveSkillProgram, getSkillPrograms, getSkillProgram, markSessionComplete };
});
