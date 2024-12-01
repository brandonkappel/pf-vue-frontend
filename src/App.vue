<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();

authStore.autoAuthUser()
if (authStore.isAuthenticated) {
  // router.push({ name: 'dashboard' })
} else {
  router.push({ name: 'login' })
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
  /* width: 100%; */
  /* margin-top: 60px; */
}
</style>
