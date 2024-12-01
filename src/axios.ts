// axios.js
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';
import { useAppStateStore } from './stores/appStateStore';
import { useAuthStore } from './stores/auth';

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your base URL
  withCredentials: true
});
interface ErrorResponseData {
  message: string; // Define other fields if necessary
}

axiosInstance.interceptors.request.use(
  (config) => {
    const appStateStore = useAppStateStore();
    const authStore = useAuthStore();
    // Show the loading state before the request
    if (!config.headers['skipLoading']) {
      appStateStore.setLoading(true);
    }
    const token = authStore.token;
    if (token) {
      config.headers;
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config; // Proceed with the request
  },
  (error) => {
    const appStateStore = useAppStateStore();
    // Handle any errors that occur before the request is sent
    appStateStore.setLoading(false); // Turn off the loading indicator
    return Promise.reject(error); // Forward the error
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any, any>): any => {
    // If the response is 200, return the response as is
    const appStateStore = useAppStateStore();
    appStateStore.setLoading(false);
    if (response.status === 200 || response.status === 201) {
      return response;
    }
  },
  (error: AxiosError<ErrorResponseData>) => {
    // Handle non-200 responses here
    const appStateStore = useAppStateStore();
    appStateStore.setLoading(false);
    if (error.response && error.response.status !== 200) {
      // Handle the error as needed, e.g., show a notification or redirect to an error page
      console.error(`Error: ${error.response.status} - ${error.response.statusText}`);
      // Optionally throw the error to be handled elsewhere
      const errorMessage = error.response.data?.message || 'An unexpected error occurred.';
      window.alert(errorMessage);
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
