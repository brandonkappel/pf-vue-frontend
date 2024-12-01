
<template>
    <!-- <div class="card">
        <h1>Header</h1>
    </div> -->
    <Card>
        <template #title>
            <div class="flex justify-between">
                <Button v-if="showBackButton" @click="goBack" label="Back" size="small"></Button>
                <div v-if="!appStateStore.isLoading">
                    {{ appStateStore.headerTitle }}
                </div>
                <Button v-if="showCreateButton" label="Create" @click="createWorkout()" size="small"></Button>
                <Button v-if="showEditButton" label="Edit" @click="createWorkout()" size="small"></Button>
            </div>

        </template>
    </Card>
</template>

<script setup lang="ts">
import { useAppStateStore } from '@/stores/appStateStore';
import { useWorkoutStore } from '@/stores/workoutStore';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const appStateStore = useAppStateStore()
const route = useRoute();
const router = useRouter();
const workoutStore = useWorkoutStore()

// Define which routes should show the back button or create button
const showBackButton = computed(() => {
    // Show back button on certain pages
    return ['workout'].includes(route.name as string);
});

const showCreateButton = computed(() => {
    // Show create button on certain pages
    return ['myWorkouts'].includes(route.name as string);
});

const showEditButton = computed(() => {
    // Show create button on certain pages
    return ['workout'].includes(route.name as string);
});

const createWorkout = () => {
    workoutStore.showCreateWorkoutDialog()
}

// Navigate back when back button is clicked
const goBack = () => {
    router.back();
};
</script>
