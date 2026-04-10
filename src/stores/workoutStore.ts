import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axiosInstance from '@/axios';
import { useAuthStore } from './auth';
import type { Workout } from '@/models/workout';

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref<Workout[]>([]);
  const workout = ref<Workout>({} as Workout);
  const header = ref('');
  const isCreateWorkoutDialogVisible = ref(false);
  const exercises = ref<any[]>([]);

  const authStore = useAuthStore();
  const userId = computed(() => authStore.userId);

  async function getWorkouts() {
    try {
      const response = await axiosInstance.get(`/workouts/${userId.value}`);
      workouts.value = response.data.workouts;
    } catch (error) {
      console.error(error);
    }
  }

  async function getWorkout(workoutId: string) {
    try {
      workout.value = {} as Workout;
      const response = await axiosInstance.get(`/workouts/workout/${workoutId}`);
      console.log('getWorkout response', response.data);
      workout.value = response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function createWorkout(newWorkout: any) {
    newWorkout.personalWorkout = '1';
    try {
      await axiosInstance.post('workouts/workouts', newWorkout);
      isCreateWorkoutDialogVisible.value = !isCreateWorkoutDialogVisible.value;
      getWorkouts();
    } catch (err) {
      console.error(err);
    }
  }

  async function updateWorkout(updatedWorkout: Workout) {
    console.log('updated', updatedWorkout);
    try {
      await axiosInstance.put(`workouts/${updatedWorkout._id}`, updatedWorkout);
      isCreateWorkoutDialogVisible.value = !isCreateWorkoutDialogVisible.value;
    } catch (err) {
      console.error(err);
    }
  }

  async function saveItemResult(
    workoutId: string,
    payload: {
      workoutItemId: string;
      exercise?: string | null;
      customExercise?: string | null;
      setsResults: {
        setNumber: number;
        reps?: number | null;
        weight?: number | null;
        time?: number | null;
        scale?: string;
        extraReps?: number | null;
      }[];
      rpe?: number | null;
      notes?: string;
    }
  ) {
    console.log('Saving item result with payload:', payload);
    try {
      await axiosInstance.patch(`workouts/${workoutId}/item-result`, payload);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async function getExercises(name: string) {
    try {
      const response = await axiosInstance.get('/auth/exercises/autocomplete', {
        params: { name },
        headers: { skipLoading: true }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function saveRecentSearch(exercise: any) {
    try {
      await axiosInstance.post(`/auth/users/${userId.value}/exercise-searched`, exercise, {
        headers: { skipLoading: true }
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function getRecentlySearched() {
    try {
      const response = await axiosInstance.get(`/auth/users/${userId.value}/recent-searches`, {
        headers: { skipLoading: true }
      });
      return response.data.map((exercise: any) => ({
        name: exercise.exerciseName,
        _id: exercise.exerciseId
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function generateWorkout(preferences: any, equipment: any, duration: any) {
    const body = { equipment, preferences, duration };
    try {
      const response = await axiosInstance.post('/auth/users/generate-workout', body, {
        headers: { skipLoading: true }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function refineSkillProgram(payload: {
    previousProgram: string;
    adjustmentNotes: string;
    movement: string;
    levelTag: string;
    levelDesc: string;
    weeks: number;
    daysPerWeek: number;
    timing: string;
  }) {
    const response = await axiosInstance.post('/skillBuilder/refine', payload, {
      headers: { skipLoading: true }
    });
    const data = response.data;
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  async function generateSkillProgram(payload: {
    category: string;
    movement: string;
    levelTag: string;
    levelDesc: string;
    weeks: number;
    daysPerWeek: number;
    timing: string;
    context: string;
  }) {
    console.log('Generating skill program with payload:', payload);

    try {
      const response = await axiosInstance.post('/skillBuilder/generate', payload, {
        headers: { skipLoading: true }
      });
      const data = response.data;
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  function showCreateWorkoutDialog() {
    isCreateWorkoutDialogVisible.value = !isCreateWorkoutDialogVisible.value;
  }

  return {
    workouts,
    workout,
    header,
    isCreateWorkoutDialogVisible,
    exercises,
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    getExercises,
    saveRecentSearch,
    getRecentlySearched,
    generateWorkout,
    generateSkillProgram,
    refineSkillProgram,
    saveItemResult,
    showCreateWorkoutDialog
  };
});
