<template>
    <div v-if="program">
        <!-- <h1>{{ workout.name }}</h1> -->
        <!-- <WorkoutHolder :workout="workout" /> -->

    </div>
    <!-- <CreateWorkoutDialog :workout="workout" /> -->
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue';
import { useWorkoutStore } from '@/stores/workoutStore';
import { useAppStateStore } from '@/stores/appStateStore';
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue';
import WorkoutHolder from '@/components/workoutHolder.vue'
import { computed } from 'vue';
import { useProgramStore } from '@/stores/programStore';

const programStore = useProgramStore()
const appStateStore = useAppStateStore()
const program = ref()

const props = defineProps({
    id: {
        type: String
    }
})

onMounted(async () => {
    console.error('prop', props)
    if (props.id) {
        program.value = await programStore.getProgram(props.id)
        appStateStore.setHeaderTitle(program.value.name)
    }
});


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
  