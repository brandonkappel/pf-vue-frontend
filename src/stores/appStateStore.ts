import { defineStore } from 'pinia'
import axiosInstance from '@/axios';
import router from '@/router';
import { useAuthStore } from './auth';
import { ref } from 'vue';

export const useAppStateStore = defineStore('appStateStore', () => {

    const headerTitle = ref('' as string);
    const isLoading = ref(false as boolean);

    const setHeaderTitle = (newTitle: string) => {
        headerTitle.value = newTitle
    }

    const setLoading = (value: boolean) => {
       isLoading.value = value
    }

  
return {
    headerTitle,
    isLoading,
    setHeaderTitle,
    setLoading,
}

})
