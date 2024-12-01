import { defineStore } from 'pinia'
import axiosInstance from '@/axios';
import { useAuthStore } from './auth';
import { ref } from 'vue';

export const useProgramStore = defineStore('programStore', () => {


    const getPrograms = async () => {
        try {
            const response = await axiosInstance.get('/programs')
            // console.error(response)
            return response.data.programs
            // console.error(this.workout);
        } catch (err){
            console.error(err)
        }
    }

    const getProgram = async (programId: string) => {
        try {
            const response = await axiosInstance.get(`/programs/${programId}`)
            console.error(response)
            return response.data
            // console.error(this.workout);
        } catch (err){
            console.error(err)
        }
    }
  
return {
getPrograms,
getProgram

}

})
