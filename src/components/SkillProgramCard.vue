<template>
  <div class="space-y-6">
    <!-- Overview -->
    <div>
      <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-1">Overview</p>
      <p class="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{{ program.overview }}</p>
    </div>

    <!-- Prerequisite Movements -->
    <div>
      <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Prerequisite Movements</p>
      <ul class="space-y-1">
        <li v-for="p in program.prerequisiteMovements" :key="p.movement" class="text-sm">
          <span class="font-semibold text-surface-700 dark:text-surface-200">{{ p.movement }}</span>
          <span class="text-surface-500 dark:text-surface-400"> — {{ p.reason }}</span>
        </li>
      </ul>
    </div>

    <!-- Week-by-Week -->
    <div>
      <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-3">Week-by-Week Breakdown</p>
      <div class="space-y-4">
        <div v-for="week in program.weeks" :key="week.weekNumber" class="border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
          <!-- Week header -->
          <button
            class="w-full flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800 text-left"
            @click="toggleWeek(week.weekNumber)"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                WK {{ week.weekNumber }}
              </span>
              <span class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ week.theme }}</span>
            </div>
            <span class="text-surface-400 text-sm">{{ openWeeks.has(week.weekNumber) ? '▲' : '▼' }}</span>
          </button>

          <!-- Sessions -->
          <div v-if="openWeeks.has(week.weekNumber)" class="divide-y divide-surface-100 dark:divide-surface-700">
            <div v-for="session in week.sessions" :key="session.sessionNumber" class="px-4 py-3">
              <div class="flex items-start gap-3">
                <!-- Completion checkbox (only shown in tracking mode) -->
                <div v-if="trackable && onComplete" class="pt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    :checked="!!session.completedAt"
                    :disabled="!!session.completedAt"
                    @change="onComplete(week.weekNumber, session.sessionNumber)"
                    class="w-4 h-4 accent-primary cursor-pointer disabled:cursor-default"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-xs font-bold tracking-widest text-surface-400">SESSION {{ session.sessionNumber }}</span>
                    <span v-if="session.completedAt" class="text-xs text-green-600 dark:text-green-400 font-medium">
                      Done {{ formatDate(session.completedAt) }}
                    </span>
                  </div>
                  <ul :class="['space-y-1', session.completedAt ? 'opacity-50' : '']">
                    <li v-for="(ex, ei) in session.exercises" :key="ei" class="text-sm">
                      <span class="font-semibold text-primary">{{ ex.format }}</span>
                      <span class="text-surface-600 dark:text-surface-400"> — {{ ex.details }}</span>
                    </li>
                  </ul>
                  <p v-if="session.progressionNote" class="mt-1.5 text-xs text-surface-400 italic">
                    {{ session.progressionNote }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Benchmarks -->
    <div v-if="program.benchmarks?.length">
      <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Benchmarks</p>
      <div class="space-y-1">
        <div v-for="b in program.benchmarks" :key="b.week" class="flex gap-3 text-sm">
          <span class="font-bold text-primary w-16 flex-shrink-0">Week {{ b.week }}</span>
          <span class="text-surface-600 dark:text-surface-400">{{ b.test }}</span>
        </div>
      </div>
    </div>

    <!-- Coach Notes -->
    <div v-if="program.coachNotes?.length">
      <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Coach Notes</p>
      <ul class="space-y-1">
        <li v-for="(note, i) in program.coachNotes" :key="i" class="text-sm text-surface-600 dark:text-surface-400 flex gap-2">
          <span class="text-primary font-bold flex-shrink-0">—</span>
          <span>{{ note }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { SkillProgramData } from '@/stores/skillProgramStore'

const props = defineProps<{
  program: SkillProgramData
  trackable?: boolean
  onComplete?: (weekNumber: number, sessionNumber: number) => void
}>()

const openWeeks = ref<Set<number>>(new Set([1]))

const toggleWeek = (weekNumber: number) => {
  if (openWeeks.value.has(weekNumber)) {
    openWeeks.value.delete(weekNumber)
  } else {
    openWeeks.value.add(weekNumber)
  }
}

const formatDate = (iso: string) => {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
</script>
