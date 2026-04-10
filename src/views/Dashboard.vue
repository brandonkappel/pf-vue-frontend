<template>
  <div class="flex flex-col h-screen bg-surface-50 dark:bg-surface-950">
    <div class="flex flex-1 overflow-hidden">

      <!-- Sidebar (desktop only) -->
      <aside class="hidden lg:flex flex-col w-56 shrink-0 border-r border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
        <div class="flex items-center gap-2 h-16 px-5 border-b border-surface-200 dark:border-surface-800 shrink-0">
          <i class="pi pi-bolt text-primary text-lg"></i>
          <div class="leading-tight">
            <span class="font-bold text-sm">Progressional</span>
            <span class="font-bold text-sm text-primary"> Fitness</span>
          </div>
        </div>

        <nav class="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-surface-100 transition-colors duration-200"
            active-class="bg-primary/10 !text-primary font-semibold"
          >
            <i :class="`pi ${item.icon} text-base w-4 text-center`"></i>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <div class="px-3 py-4 border-t border-surface-200 dark:border-surface-800 shrink-0">
          <button
            @click="handleLogout"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm text-surface-600 dark:text-surface-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
          >
            <i class="pi pi-sign-out text-base w-4 text-center"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <Header />
        <Loader v-if="appStateStore.isLoading" />
        <main class="flex-1 overflow-auto p-4 pb-24 lg:pb-4">
          <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </Transition>
          </router-view>
        </main>
      </div>

    </div>

    <!-- Bottom tab bar (mobile only) -->
    <nav class="fixed bottom-0 left-0 right-0 lg:hidden flex items-stretch border-t border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 z-40">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs text-surface-400 dark:text-surface-500 transition-colors duration-200"
        active-class="!text-primary"
      >
        <i :class="`pi ${item.icon} text-xl`"></i>
        <span>{{ item.label }}</span>
      </router-link>
      <button
        @click="handleLogout"
        class="flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs text-surface-400 dark:text-surface-500 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
      >
        <i class="pi pi-sign-out text-xl"></i>
        <span>Logout</span>
      </button>
    </nav>

  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from '@/stores/auth'
import { useAppStateStore } from '@/stores/appStateStore'
import Header from '@/components/header.vue';
import Loader from '@/components/loader.vue';

const authStore = useAuthStore()
const appStateStore = useAppStateStore()
const router = useRouter()

const navItems = [
  { label: 'Home', icon: 'pi-home', to: '/home' },
  { label: 'Workouts', icon: 'pi-bolt', to: '/my-workouts' },
  { label: 'Programs', icon: 'pi-list-check', to: '/programs' },
  { label: 'Skill Lab', icon: 'pi-star', to: '/skill-builder' },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-leave-active {
  transition: none;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.page-leave-to {
  opacity: 0;
}
</style>
