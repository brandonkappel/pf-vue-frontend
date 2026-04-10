<template>
  <div class="space-y-5 pb-4">

    <!-- Greeting -->
    <div>
      <p class="text-surface-400 dark:text-surface-500 text-sm">
        {{ greeting }}, <span class="font-bold text-surface-800 dark:text-surface-100">{{ firstName }}</span>
      </p>
    </div>

    <!-- Stat chips -->
    <div class="grid grid-cols-3 gap-3">
      <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 p-4">
        <p class="text-xs font-bold tracking-widest uppercase text-surface-400 dark:text-surface-500 mb-1">Workouts</p>
        <p class="text-3xl font-black text-surface-900 dark:text-surface-50">{{ workouts.length }}</p>
        <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">total logged</p>
      </div>
      <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 p-4">
        <p class="text-xs font-bold tracking-widest uppercase text-surface-400 dark:text-surface-500 mb-1">Skill Programs</p>
        <p class="text-3xl font-black text-surface-900 dark:text-surface-50">{{ skillPrograms.length }}</p>
        <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">active</p>
      </div>
      <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 p-4">
        <p class="text-xs font-bold tracking-widest uppercase text-surface-400 dark:text-surface-500 mb-1">This Week</p>
        <p class="text-3xl font-black text-surface-900 dark:text-surface-50">{{ thisWeekCount }}</p>
        <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">sessions</p>
      </div>
    </div>

    <!-- Main grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

      <!-- Recent Workouts -->
      <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
        <div class="flex items-center justify-between px-4 pt-4 pb-3 border-b border-surface-100 dark:border-surface-800">
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500">Recent Workouts</p>
          <router-link to="/my-workouts" class="text-xs text-primary font-semibold hover:underline">View all</router-link>
        </div>

        <div v-if="loading" class="flex justify-center py-8">
          <i class="pi pi-spin pi-spinner text-xl text-primary" />
        </div>

        <div v-else-if="recentWorkouts.length === 0" class="px-4 py-8 text-center">
          <p class="text-sm text-surface-400 dark:text-surface-500">No workouts yet.</p>
          <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">
            <router-link to="/my-workouts" class="text-primary hover:underline">Log your first workout</router-link>
          </p>
        </div>

        <div v-else>
          <router-link
            v-for="(w, i) in recentWorkouts"
            :key="w._id"
            :to="{ name: 'workout', params: { id: w._id } }"
            :class="[
              'flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150',
              i !== recentWorkouts.length - 1 ? 'border-b border-surface-100 dark:border-surface-800' : ''
            ]"
          >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">{{ w.name }}</p>
              <p class="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{{ formatDate(w.date) }}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-3">
              <span class="text-xs text-surface-400 dark:text-surface-500">{{ w.workoutItems?.length ?? 0 }} items</span>
              <i class="pi pi-angle-right text-surface-300 dark:text-surface-600 text-sm" />
            </div>
          </router-link>
        </div>
      </div>

      <!-- Skill Programs -->
      <div class="rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900">
        <div class="flex items-center justify-between px-4 pt-4 pb-3 border-b border-surface-100 dark:border-surface-800">
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500">Skill Programs</p>
          <router-link to="/programs" class="text-xs text-primary font-semibold hover:underline">View all</router-link>
        </div>

        <div v-if="loadingSkill" class="flex justify-center py-8">
          <i class="pi pi-spin pi-spinner text-xl text-primary" />
        </div>

        <div v-else-if="skillPrograms.length === 0" class="px-4 py-8 text-center">
          <p class="text-sm text-surface-400 dark:text-surface-500">No skill programs yet.</p>
          <p class="text-xs text-surface-400 dark:text-surface-500 mt-1">
            <router-link to="/skill-builder" class="text-primary hover:underline">Build your first one</router-link>
          </p>
        </div>

        <div v-else>
          <router-link
            v-for="(sp, i) in recentSkillPrograms"
            :key="sp._id"
            :to="{ name: 'skillProgram', params: { id: sp._id } }"
            :class="[
              'flex items-center justify-between px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150',
              i !== recentSkillPrograms.length - 1 ? 'border-b border-surface-100 dark:border-surface-800' : ''
            ]"
          >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">{{ sp.movement }}</p>
              <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                <span class="text-[10px] font-bold tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {{ sp.levelTag }}
                </span>
                <span class="text-[10px] font-semibold bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 px-1.5 py-0.5 rounded">
                  {{ sp.timing }}
                </span>
                <span class="text-[10px] text-surface-400 dark:text-surface-500">
                  {{ sp.weeksCount ?? sp.weeks?.length ?? '?' }} wks
                </span>
              </div>
            </div>
            <i class="pi pi-angle-right text-surface-300 dark:text-surface-600 text-sm shrink-0 ml-3" />
          </router-link>
        </div>
      </div>

    </div>

    <!-- Quick Actions -->
    <div>
      <p class="text-xs font-bold tracking-widest uppercase text-surface-400 dark:text-surface-500 mb-3">Quick Actions</p>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <router-link
          to="/my-workouts"
          class="flex flex-col items-start gap-2 p-4 rounded-xl border-2 border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
        >
          <i class="pi pi-bolt text-primary text-lg" />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">My Workouts</span>
        </router-link>
        <router-link
          to="/skill-builder"
          class="flex flex-col items-start gap-2 p-4 rounded-xl border-2 border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
        >
          <i class="pi pi-star text-primary text-lg" />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">Skill Builder</span>
        </router-link>
        <router-link
          to="/programs"
          class="flex flex-col items-start gap-2 p-4 rounded-xl border-2 border-surface-200 dark:border-surface-800 bg-surface-0 dark:bg-surface-900 hover:border-primary/40 hover:bg-primary/5 transition-all duration-150"
        >
          <i class="pi pi-list-check text-primary text-lg" />
          <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">Programs</span>
        </router-link>
        <button
          @click="workoutStore.showCreateWorkoutDialog()"
          class="flex flex-col items-start gap-2 p-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all duration-150"
        >
          <i class="pi pi-plus text-primary text-lg" />
          <span class="text-sm font-semibold text-primary">New Workout</span>
        </button>
      </div>
    </div>

    <CreateWorkoutDialog v-if="workoutStore.isCreateWorkoutDialogVisible" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useSkillProgramStore } from '@/stores/skillProgramStore'
import type { SavedSkillProgram } from '@/stores/skillProgramStore'
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue'

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()
const skillProgramStore = useSkillProgramStore()

const loading = ref(false)
const loadingSkill = ref(false)
const skillPrograms = ref<SavedSkillProgram[]>([])

const firstName = computed(() => authStore.user?.firstName ?? 'there')
const workouts = computed(() => workoutStore.workouts)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
})

const thisWeekCount = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return workouts.value.filter(w => new Date(w.date) >= startOfWeek).length
})

const recentWorkouts = computed(() => {
  return [...workouts.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
})

const recentSkillPrograms = computed(() => {
  return [...skillPrograms.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
})

const formatDate = (date: Date | string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(async () => {
  loading.value = true
  await workoutStore.getWorkouts()
  loading.value = false

  loadingSkill.value = true
  skillPrograms.value = await skillProgramStore.getSkillPrograms()
  loadingSkill.value = false
})
</script>
