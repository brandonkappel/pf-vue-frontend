<template>
  <div class="space-y-4 pb-28 lg:pb-8">

    <!-- Search -->
    <div class="relative">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm pointer-events-none" />
      <input
        v-model="search"
        type="text"
        placeholder="Search workouts..."
        class="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-800 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:border-primary transition-colors duration-150"
      />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <i class="pi pi-spin pi-spinner text-2xl text-primary" />
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredWorkouts.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
      <i class="pi pi-bolt text-4xl text-surface-200 dark:text-surface-700 mb-3" />
      <p class="text-sm font-semibold text-surface-500 dark:text-surface-400">
        {{ search ? 'No workouts match your search' : 'No workouts yet' }}
      </p>
      <p v-if="!search" class="text-xs text-surface-400 dark:text-surface-500 mt-1">
        Tap the + button below to log your first workout
      </p>
    </div>

    <!-- Grouped list -->
    <template v-else>
      <div v-for="group in groupedWorkouts" :key="group.month" class="space-y-2">
        <!-- Month header -->
        <p class="text-xs font-bold tracking-widest uppercase text-surface-400 dark:text-surface-500 px-1">
          {{ group.month }}
        </p>

        <!-- Workout cards -->
        <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 overflow-hidden">
          <router-link
            v-for="(workout, i) in group.items"
            :key="workout._id"
            :to="{ name: 'workout', params: { id: workout._id } }"
            :class="[
              'flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150',
              i !== group.items.length - 1 ? 'border-b border-surface-100 dark:border-surface-800' : ''
            ]"
          >
            <!-- Date badge -->
            <div class="shrink-0 w-10 text-center">
              <p class="text-lg font-black leading-none text-surface-800 dark:text-surface-100">{{ dayOf(workout.date) }}</p>
              <p class="text-[10px] uppercase font-bold text-surface-400 dark:text-surface-500 tracking-wide">{{ weekdayOf(workout.date) }}</p>
            </div>

            <!-- Divider -->
            <div class="w-px self-stretch bg-surface-100 dark:bg-surface-800 shrink-0" />

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">{{ workout.name }}</p>
              <div class="flex items-center gap-2 mt-1 flex-wrap">
                <span class="text-[10px] font-semibold bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 px-1.5 py-0.5 rounded">
                  {{ workout.workoutItems?.length ?? 0 }} {{ workout.workoutItems?.length === 1 ? 'item' : 'items' }}
                </span>
                <span
                  v-for="badge in workoutBadges(workout)"
                  :key="badge"
                  class="text-[10px] font-bold tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded"
                >
                  {{ badge }}
                </span>
              </div>
            </div>

            <i class="pi pi-angle-right text-surface-300 dark:text-surface-600 text-sm shrink-0" />
          </router-link>
        </div>
      </div>
    </template>

    <CreateWorkoutDialog v-if="workoutStore.isCreateWorkoutDialogVisible" />

    <Button
      @click="workoutStore.showCreateWorkoutDialog()"
      icon="pi pi-plus"
      rounded
      class="!fixed bottom-24 right-5 lg:bottom-6 !w-14 !h-14 shadow-xl z-30"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useAppStateStore } from '@/stores/appStateStore'
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue'
import type { Workout } from '@/models/workout'

const workoutStore = useWorkoutStore()
const appStateStore = useAppStateStore()
const loading = ref(false)
const search = ref('')

const workouts = computed(() => workoutStore.workouts)

const filteredWorkouts = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return workouts.value
  return workouts.value.filter(w => w.name?.toLowerCase().includes(q))
})

const groupedWorkouts = computed(() => {
  const sorted = [...filteredWorkouts.value].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const groups: { month: string; items: Workout[] }[] = []
  const seen = new Map<string, Workout[]>()

  for (const w of sorted) {
    const key = new Date(w.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!seen.has(key)) {
      seen.set(key, [])
      groups.push({ month: key, items: seen.get(key)! })
    }
    seen.get(key)!.push(w)
  }

  return groups
})

const dayOf = (date: Date | string) => new Date(date).getDate()
const weekdayOf = (date: Date | string) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short' })

const workoutBadges = (workout: Workout): string[] => {
  const types = new Set<string>()
  for (const item of workout.workoutItems ?? []) {
    if (item.type) types.add(item.type)
  }
  return [...types].slice(0, 2)
}

onMounted(async () => {
  appStateStore.setHeaderTitle('My Workouts')
  loading.value = true
  await workoutStore.getWorkouts()
  loading.value = false
})
</script>
