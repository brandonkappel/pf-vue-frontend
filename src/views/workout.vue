<template>
    <div v-if="workout">
        <h1>{{ workout.name }}</h1>
        <WorkoutHolder :workout="workout" />

    </div>
    <CreateWorkoutDialog :workout="workout" />
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAppStateStore } from '@/stores/appStateStore';
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue';
import WorkoutHolder from '@/components/workoutHolder.vue'
import { computed } from 'vue';
import { onBeforeMount } from 'vue';

const workoutStore = useWorkoutStore()
const appStateStore = useAppStateStore()

const props = defineProps({
    id: {
        type: String
    }
})

onBeforeMount(async () => {
    if (props.id) {
        await workoutStore.getWorkout(props.id)
        appStateStore.setHeaderTitle(workout.value.name)
    }
});

const workout = computed(() => workoutStore.workout)

</script>
  
<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
  