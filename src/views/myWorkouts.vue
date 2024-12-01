<template>
    <!-- <div class="about">
        <h1>This is an about page</h1>
    </div> -->
    <DataViewList :items="workouts" targetRoute="workout" />
    <CreateWorkoutDialog />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useWorkoutStore } from '@/stores/workoutStore';
import DataViewList from '@/components/dataViewList.vue';
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue';
import { computed } from 'vue';


const workoutStore = useWorkoutStore()
const workouts = computed(() => workoutStore.workouts);

onMounted(() => {
    workoutStore.getWorkouts()
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
  