import { defineStore } from 'pinia'
import axiosInstance from '@/axios';
import router from '@/router';
import { useAuthStore } from './auth';
import type { Workout } from '@/models/workout';
import {useRoute} from 'vue-router'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    workout: {} as Workout,
    header: '',
    isCreateWorkoutDialogVisible: false,
    exercises: []
  }),

  
  actions: {
    async getWorkouts() {
        const authStore = useAuthStore()
      try {
        const response = await axiosInstance.get(`/workouts/workouts/${authStore.userId}`)
        this.workouts = response.data.workouts
        // console.error(this.workouts)

      } catch (error){

      }
    },

    async getWorkout(workoutId: string) {
      try {
        const response = await axiosInstance.get(`/workouts/${workoutId}`)
            this.workout = response.data
            // console.error(this.workout);
      } catch (error){

      }
    },

    async createWorkout(workout:any) {
      workout.personalWorkout = '1';
      try {
        const response = await axiosInstance.post('workouts/workouts', workout)
        console.error('res', response);
      } catch (err) {
        console.error(err)
      }
    },
    async getExercises(name: string) {
      try {
        const response = await axiosInstance.get('/auth/exercises/autocomplete', {params: {name}, headers: {
          skipLoading: true 
        }})
        // console.error(response)
        return response.data
      } catch (error) {

      }
    },

    async saveRecentSearch(exercise:any) {
      const authStore = useAuthStore()

      try {
        const response = await axiosInstance.post(`/auth/users/${authStore.userId}/exercise-searched`, exercise, 
        {
          headers: {
            skipLoading: true 
          }
        })
      } catch (error){

      }
    },

    async getRecentlySearched() {
      const authStore = useAuthStore()
      try {
        const response = await axiosInstance.get(`/auth/users/${authStore.userId}/recent-searches`,  {
          headers: {
            skipLoading: true 
          }
        })
        const exercises = await response.data.map((exercise:any) => {
          return {
            // ...exercise,
            name: exercise.exerciseName,
            _id: exercise.exerciseId,
          }
        })
        console.error('exer', exercises);
        return exercises
      } catch (error) {
        
      }
    },

    async generateWorkout(preferences: any,equipment: any, duration: any) {
      const body = {equipment, preferences, duration}
      console.error(body)
      try {
        const response = await axiosInstance.post('/auth/users/generate-workout', body, {
          headers: {
            skipLoading: true 
          }
        })
        console.error(response)
        return response.data
      } catch (error) {

      }

    },

    showCreateWorkoutDialog(){
      this.isCreateWorkoutDialogVisible === true ? this.isCreateWorkoutDialogVisible = false : this.isCreateWorkoutDialogVisible = true ;
    },
  },
})
