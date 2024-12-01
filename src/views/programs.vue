<template>
    <!-- <div class="about">
        <h1>This is an about page</h1>
    </div> -->
    <DataViewList :items="programs" targetRoute="program" />
    <!-- <CreateWorkoutDialog /> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import DataViewList from '@/components/dataViewList.vue';
import CreateWorkoutDialog from '@/components/createWorkoutDialog.vue';
import { computed } from 'vue';
import { useProgramStore } from '@/stores/programStore';

const programStore = useProgramStore()
const programs = ref([])

onMounted(async () => {
    programs.value = await programStore.getPrograms()
    console.error(programs.value)
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
  