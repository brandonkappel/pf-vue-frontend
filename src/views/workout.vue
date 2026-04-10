<template>
  <div class="max-w-2xl mx-auto space-y-6 pb-32 lg:pb-8">
    <div v-if="workout?._id">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h1 class="text-xl font-bold text-surface-800 dark:text-surface-100">{{ workout.name }}</h1>
          <p class="text-sm text-surface-400 mt-0.5">{{ formatDate(workout.date) }}</p>
        </div>
      </div>

      <WorkoutHolder />
    </div>
    <CreateWorkoutDialog v-if="workoutStore.isCreateWorkoutDialogVisible" :workout="workout"
      @workoutUpdated="updateWorkoutList" />

    <!-- Edit FAB -->
    <Button @click="workoutStore.showCreateWorkoutDialog()" icon="pi pi-pencil" rounded
      class="!fixed bottom-24 right-5 lg:bottom-6 !w-14 !h-14 shadow-xl z-30" />
  </div>
</template>

<script setup lang="ts">
import { watch, computed, onBeforeMount, onUnmounted } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useAppStateStore } from '@/stores/appStateStore'
import { formatDate } from '@/shared/formatter'
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue'
import WorkoutHolder from '@/components/workoutHolder.vue'

const workoutStore = useWorkoutStore()
const appStateStore = useAppStateStore()

const props = defineProps({
  id: { type: String }
})

const workout = computed(() => workoutStore.workout)

onBeforeMount(async () => {
  if (props.id) await workoutStore.getWorkout(props.id)
})

watch(workout, (w) => {
  if (w?.name) appStateStore.setHeaderTitle(w.name)
})

onUnmounted(() => {
  appStateStore.setHeaderTitle('')
})

const updateWorkoutList = (updatedWorkout: any) => {
  workoutStore.workout = updatedWorkout
}
</script>
