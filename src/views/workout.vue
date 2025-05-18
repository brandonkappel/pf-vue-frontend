<template>
    <div v-if="workout">
        <h1>{{ workout.name }}</h1>
        <WorkoutHolder :workout="workout" />

    </div>
    <CreateWorkoutDialog v-if="workoutStore.isCreateWorkoutDialogVisible" :workout="workout"
        @workoutUpdated="updateWorkoutList" />
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs, watch } from 'vue';
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
const workout = computed(() => workoutStore.workout)


onBeforeMount(async () => {
    if (props.id) {
        await workoutStore.getWorkout(props.id)
    }
});

watch(workout, (newWorkout) => {
    if (newWorkout?.name) {
        appStateStore.setHeaderTitle(newWorkout.name);
    }
});


const updateWorkoutList = (updatedWorkout: any) => {
    // console.error('updated', updatedWorkout)
    workoutStore.workout = updatedWorkout
};

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
  