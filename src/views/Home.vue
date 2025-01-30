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
  <h1>hello</h1>
  <div>
    <h1>Exercises</h1>
    <ul>
      <li v-for="exercise in exercises.results" :key="exercise?.id">
        {{ exercise?.name }}
      </li>
    </ul>
  </div>
  <!-- <main>
    <TheWelcome />
  </main> -->
</template>
