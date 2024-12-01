<template>
    <div class="card rounded-lg">
        {{ workout.name }}
        {{ formatDate(workout.date) }}

    </div>

    <Card v-for="item in props.workout.workoutItems" class="mb-2">
        <template #title>{{ item.type }}</template>
        <template #content>
            <p v-if="item.description" class="m-0" style="white-space: pre-wrap;">
                {{ item.description }}
            </p>
            <div v-if="item.exercise" class="flex-wrap">
                <p>
                    {{ item.exercise.name }}
                </p>
                <p>Sets: {{ item.sets }}</p>
                <p>Reps: {{ item.reps }}</p>

            </div>

        </template>
    </Card>
</template>
  
<script setup lang="ts">
import { defineProps } from 'vue';
import { formatDate } from '@/shared/formatter'
import type { Workout } from '@/models/workout';

const props = defineProps({
    workout: {
        type: Object,
        required: true
    }
});
console.error('props', props.workout)
</script>
  
<style scoped>
.product-item {
    padding: 1rem;
    /* border-bottom: 1px solid #d3d3d3; */
}

.product-image {
    width: 100%;
}
</style>
  