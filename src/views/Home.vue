<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import { ref, onMounted } from 'vue';

const exercises = ref([]);

onMounted(async () => {
  try {
    const response = await fetch('/crossfitExercises.json'); // Path relative to `public` folder
    if (!response.ok) throw new Error('Failed to fetch exercises');
    exercises.value = await response.json();
    // const exercises = await response.json();
    console.log('exercises:', exercises)
  } catch (error) {
    console.error('Error loading exercises:', error);
  }
});
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
