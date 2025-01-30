<template>
  <Menubar>
    <template #start>
      <!-- Toggle Button for Mobile -->
      <div class="h-10 flex items-center">
        <div class="mx-2">
          <button @click="toggleMenu" text class=" p-2  lg:hidden z-50">
            <i :class="isMenuVisible ? 'pi pi-times' : 'pi pi-bars'"></i>
          </button>
        </div>
        <span class="text-xl font-semibold">Progressional</span>
        <span class="text-xl font-semibold text-primary">Fitness</span>
      </div>

    </template>
  </Menubar>
  <div class="flex h-screen">
    <!-- Side Menu -->
    <div :class="[
      'fixed top-0 left-0 h-full shadow-md transition-transform duration-300 z-40',
      { '-translate-x-full': !isMenuVisible, 'translate-x-0': isMenuVisible },
      'lg:relative lg:translate-x-0 lg:w-32'
    ]">
      <Menu :model="items" class="w-full h-full">
        <!-- Menu Header -->
        <template #start v-if="isMenuVisible">
          <div class="flex justify-center h-16 w-full">
            <span class="inline-flex flex-col items-center px-2 py-2">
              <!-- Uncomment and add SVG if needed -->
              <!-- <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-8"></svg> -->
              <span class="text-xl font-semibold">Progressional</span>
              <span class="text-xl font-semibold text-primary">Fitness</span>
            </span>
          </div>
        </template>

        <!-- Item Template -->
        <template #item="{ item }">
          <router-link :to="item.to"
            class="flex flex-col items-center p-2 hover:bg-surface-100 dark:hover:bg-surface-800 rounded transition-colors duration-200">
            <i :class="`pi ${item.icon} mr-2`" />
            <span>{{ item.label }}</span>
          </router-link>
        </template>

      </Menu>
    </div>

    <!-- Main Content Area with Router View -->
    <div class="flex-1 overflow-auto ">
      <div class="px-4">
        <Header />
      </div>
      <Loader v-if="appStateStore.isLoading" />

      <div class="p-4">
        <router-view />
      </div>
    </div>

    <!-- Overlay for Mobile -->
    <div v-if="isMenuVisible" @click="toggleMenu" class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"></div>

  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Menu from "primevue/menu";
import { useAuthStore } from '@/stores/auth'
import { useAppStateStore } from '@/stores/appStateStore'
import Header from '@/components/header.vue';
import Loader from '@/components/loader.vue';

const authStore = useAuthStore()
const appStateStore = useAppStateStore()
const isMenuVisible = ref(false)


const items = ref([
  // { separator: true },
  {
    items: [
      { label: 'Home', icon: 'pi pi-home', to: '/home' },
      { label: 'My Workouts', icon: 'pi pi-bolt', to: '/my-workouts' },
      { label: 'Programs', icon: 'pi pi-bolt', to: '/programs' },
      // { label: 'Favorites', icon: 'pi pi-heart', },
      // { label: 'Programs', icon: 'pi pi-list-check', },
      // { label: 'Clients', icon: 'pi pi-users', badge: 2, },
      // { label: 'Admin', icon: 'pi pi-shield', },
      // { label: 'Settings', icon: 'pi pi-cog', },
      {
        label: 'Logout', icon: 'pi pi-sign-out', to: '/login',
        command: () => {
          authStore.logout()
        }
      }
    ]
  },
  // { separator: true }
]);
const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};
</script>

<style scoped>
.card {
  /* Custom styles for the menu card */
  /* max-height: 100vh; */
  /* Ensure full height menu */
}

/* Optional: Adjust menu width */
.card {
  /* width: 32px; */
  /* Collapsed width on larger screens */
}

::v-deep(.p-menu) {
  min-width: auto !important;
  ;
}

@media (min-width: 1024px) {
  .card {
    /* width: 16rem; */
    /* Expanded width on larger screens */
  }
}
</style>
