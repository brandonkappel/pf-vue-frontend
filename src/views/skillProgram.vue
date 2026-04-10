<template>
  <div class="max-w-2xl mx-auto pb-32 lg:pb-8">
    <div v-if="loading" class="flex justify-center py-16">
      <i class="pi pi-spin pi-spinner text-2xl text-primary" />
    </div>

    <div v-else-if="program" class="space-y-6">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-xl font-bold text-surface-800 dark:text-surface-100">{{ program.movement }}</h1>
          <p class="text-sm text-surface-400 mt-1">
            {{ program.levelTag }} &bull; {{ program.weeks }} wks &bull; {{ program.daysPerWeek }}×/wk &bull; {{ program.timing }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-surface-400">
            {{ completedCount }} / {{ totalSessions }} sessions complete
          </p>
          <div class="mt-1 w-40 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all duration-300"
              :style="{ width: `${progressPct}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Program content -->
      <Card>
        <template #content>
          <SkillProgramCard
            :program="programData"
            :trackable="true"
            :on-complete="markComplete"
          />
        </template>
      </Card>
    </div>

    <div v-else class="text-center py-16 text-surface-400">Program not found.</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useSkillProgramStore } from '@/stores/skillProgramStore'
import type { SavedSkillProgram, SkillProgramData } from '@/stores/skillProgramStore'
import { useAppStateStore } from '@/stores/appStateStore'
import SkillProgramCard from '@/components/SkillProgramCard.vue'

const props = defineProps<{ id: string }>()

const skillProgramStore = useSkillProgramStore()
const appStateStore = useAppStateStore()

const program = ref<SavedSkillProgram | null>(null)
const loading = ref(true)

// Shape the saved program into what SkillProgramCard expects
const programData = computed<SkillProgramData>(() => ({
  overview: program.value?.overview ?? '',
  prerequisiteMovements: program.value?.prerequisiteMovements ?? [],
  weeks: program.value?.program ?? [],
  benchmarks: program.value?.benchmarks ?? [],
  coachNotes: program.value?.coachNotes ?? [],
}))

const totalSessions = computed(() =>
  (program.value?.program ?? []).reduce((sum, w) => sum + w.sessions.length, 0)
)

const completedCount = computed(() =>
  (program.value?.program ?? []).reduce(
    (sum, w) => sum + w.sessions.filter(s => !!s.completedAt).length,
    0
  )
)

const progressPct = computed(() =>
  totalSessions.value ? Math.round((completedCount.value / totalSessions.value) * 100) : 0
)

const markComplete = async (weekNumber: number, sessionNumber: number) => {
  if (!program.value) return
  await skillProgramStore.markSessionComplete(program.value._id, weekNumber, sessionNumber)
  // Optimistic update
  const week = program.value.program.find(w => w.weekNumber === weekNumber)
  const session = week?.sessions.find(s => s.sessionNumber === sessionNumber)
  if (session) session.completedAt = new Date().toISOString()
}

onMounted(async () => {
  program.value = await skillProgramStore.getSkillProgram(props.id)
  if (program.value) {
    appStateStore.setHeaderTitle(program.value.movement)
  }
  loading.value = false
})
</script>
