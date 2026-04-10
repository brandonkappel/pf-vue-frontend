<template>
  <div
    class="flex items-center justify-between h-14 px-4 shrink-0 border-b border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900"
  >
    <!-- Left: back button + page title -->
    <div class="flex items-center gap-2 min-w-0">
      <Button
        v-if="showBackButton"
        @click="goBack"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        rounded
        class="shrink-0 !w-10 !h-10"
      />
      <Transition name="header-title" mode="out-in">
        <span
          v-if="appStateStore.headerTitle"
          :key="appStateStore.headerTitle"
          class="font-bold text-lg text-surface-900 dark:text-surface-50 truncate"
        >
          {{ appStateStore.headerTitle }}
        </span>
        <div v-else class="flex items-center gap-2 lg:hidden">
          <i class="pi pi-bolt text-primary"></i>
          <span class="font-bold text-base">Progressional<span class="text-primary"> Fitness</span></span>
        </div>
      </Transition>
    </div>

    <!-- Right: contextual action + profile -->
    <div class="flex items-center gap-1 shrink-0">
      <Button
        @click="(e) => profileMenu?.toggle(e)"
        :label="userInitial"
        rounded
        class="!w-9 !h-9 !text-sm font-bold"
        aria-label="Profile"
      />
      <Menu ref="profileMenu" :model="profileMenuItems" popup />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAppStateStore } from '@/stores/appStateStore';
import { useAuthStore } from '@/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const appStateStore = useAppStateStore()
const authStore = useAuthStore()
const route = useRoute();
const router = useRouter();
const profileMenu = ref()

const showBackButton = computed(() => ['workout'].includes(route.name as string))

const userInitial = computed(() => {
  const name = authStore.user?.firstName
  return name ? name[0].toUpperCase() : '?'
})

const profileMenuItems = computed(() => [
  {
    items: [
      {
        label: authStore.user?.firstName
          ? `${authStore.user.firstName} ${authStore.user.lastName}`
          : authStore.user?.email ?? 'Profile',
        icon: 'pi pi-user',
        disabled: true
      }
    ]
  },
  { separator: true },
  {
    items: [
      { label: 'Settings', icon: 'pi pi-cog', command: () => {} },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => authStore.logout()
      }
    ]
  }
])

const goBack = () => router.back()
</script>

<style scoped>
.header-title-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.header-title-leave-active {
  transition: none;
}
.header-title-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.header-title-leave-to {
  opacity: 0;
}
</style>
