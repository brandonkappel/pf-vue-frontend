import { defineStore } from 'pinia';
import axios from 'axios';
import axiosInstance from '@/axios';
import router from '@/router';
import type { User } from '@/models/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {} as User,
    token: '' as string | null,
    userId: '' as string | null,
    isAuthenticated: false as boolean,
    tokenTimer: undefined as any,
    isSignupDialogVisible: false,
    isPasswordDialogVisible: false,
    userEmail: '' as string | null
  }),

  actions: {
    async findUser(email: string) {
      this.userEmail = email;
      try {
        const response = await axiosInstance.post('/auth/find-user', { email: email });
        console.log(response);
        this.user = response.data.user;
        if (this.user) {
          if (this.user.active) {
            this.showPasswordDialog();
          } else {
            // If user isn't active
            this.showSignupDialog();
          }
        } else {
          // If no user is found
          this.showSignupDialog();
        }
      } catch (error) {}
    },

    async setUpUser() {
      try {
        const response = await axiosInstance.post('/auth/send-code', { email: this.userEmail });
        console.log(response);
        this.user = response.data.user;
      } catch (error) {}
    },

    async createUser(credentials: any) {
      credentials.email = this.user.email;
      try {
        const response = await axiosInstance.post('/auth/create-user', credentials);
        this.showSignupDialog();
        router.push({ name: 'dashboard' });
        this.configureUser(response.data);
      } catch (error) {}
    },
    async login(password: string) {
      const credentials = { email: this.user.email, password };
      try {
        const response = await axiosInstance.post('/auth/login', credentials);
        this.showPasswordDialog();
        this.configureUser(response.data);
        router.push({ name: 'myWorkouts' });
        // this.token = response.data.token
      } catch (error) {
        return error;
      }
    },

    configureUser(userDetails: any) {
      this.user = userDetails.user;
      this.token = userDetails.token;
      this.userId = this.user._id;
      this.isAuthenticated = true;
      const expiresInDuration = userDetails.expiresIn;
      this.setAuthTimer(expiresInDuration);
      const now = new Date();
      const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
      this.saveAuthData(userDetails.token, expirationDate, this.user._id, this.user.role);
    },

    setAuthTimer(duration: number) {
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    },

    saveAuthData(token: string, expirationDate: Date, userId: string, role: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRole', role);
    },

    clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
    },

    autoAuthUser() {
      const authInformation = this.getAuthData();
      if (!authInformation) {
        return;
      }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.userId = authInformation.userId;
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);
      }
    },

    getAuthData() {
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      const userRole = localStorage.getItem('userRole');

      if (token === '' || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
        userRole: userRole
      };
    },

    logout() {
      this.user = {} as User;
      this.token = null;
      this.isAuthenticated = false;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      router.push({ name: 'login' });
    },

    showSignupDialog() {
      this.isSignupDialogVisible === true
        ? (this.isSignupDialogVisible = false)
        : (this.isSignupDialogVisible = true);
    },
    showPasswordDialog() {
      this.isPasswordDialogVisible === true
        ? (this.isPasswordDialogVisible = false)
        : (this.isPasswordDialogVisible = true);
    }
  }
});
