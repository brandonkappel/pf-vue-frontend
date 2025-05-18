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
      const response = await axiosInstance.get(`/workouts/workouts/${userId.value}`);
      workouts.value = response.data.workouts;
    } catch (error) {
      console.error(error);
    }
  }

  async function getWorkout(workoutId: string) {
    try {
      workout.value = {} as Workout;
      const response = await axiosInstance.get(`/workouts/${workoutId}`);
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
    showCreateWorkoutDialog
  };
});
