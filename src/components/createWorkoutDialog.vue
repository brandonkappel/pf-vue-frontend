<template>
    <Dialog :visible="workoutStore.isCreateWorkoutDialogVisible" modal @update:visible="hideDialog"
        :header="workout ? workout.name : 'New Workout'" :style="{ width: '75vw', height: '85%' }"
        :breakpoints="{ '1199px': '85vw', '575px': '90vw' }" pt:mask:class="backdrop-blur-sm">
        <div class="flex gap-3 mb-3 flex-wrap">
            <FloatLabel variant="in">
                <InputText id="name" v-model="workout.name" autocomplete="off" />
                <label for="name">Workout Name</label>
            </FloatLabel>
            <FloatLabel variant="in">
                <DatePicker v-model="workout.date" inputId="date" showIcon iconDisplay="input" />
                <label for="date">Date</label>
            </FloatLabel>
        </div>
        <hr>
        <div class="my-3 relative" v-for="(item, index) in workoutItems" :key="index">
            <div class="mb-3 flex justify-between gap-3 flex-wrap">
                <div class="w-full md:w-56" v-if="!item.readOnly">
                    <FloatLabel class="w-full" variant="in">
                        <Select v-model="item.type" inputId="workoutType" @change="typeChange(index)"
                            :options="workoutTypes" optionLabel="" class="w-full" />
                        <label for="workoutType">Workout Type</label>
                    </FloatLabel>
                </div>
                <div v-if="!item.readOnly && item.type === 'Metcon'">
                    <SelectButton v-model="metconType" :options="metconTypes" aria-labelledby="basic" />
                </div>
            </div>

            <!-- METCON -->
            <div v-if="item.type === 'Metcon'">
                <div v-if="metconType === 'Generated Workout'" class="flex flex-col gap-3 my-2">
                    <div class="flex flex-wrap gap-2">
                        <span>Equipment Available:</span>
                        <div v-for="(equipment, index) in availableEquipment" :key="index">
                            <Checkbox v-model="item.selectedEquipment" :disabled="item.readOnly" :inputId="equipment"
                                name="dynamic" :value="equipment" />
                            <label :for="equipment" class="ml-2">{{ equipment }}</label>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span>Workout Type:</span>
                        <div v-for="(type, index) in scoreTypes" :key="index">
                            <RadioButton v-model="item.scoreType" :disabled="item.readOnly" :inputId="type" name="dynamic"
                                :value="type" />
                            <label :for="type" class="ml-2">{{ type }}</label>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                        <span>Duration:</span>
                        <div v-for="(duration, index) in durations" :key="index">
                            <RadioButton v-model="item.selectedDuration" :disabled="item.readOnly" :inputId="duration"
                                name="dynamic" :value="duration" />
                            <label :for="duration" class="ml-2">{{ duration }}</label>
                        </div>

                    </div>

                    <Button v-if="!item.readOnly" class="my-3" size="small" @click="generateWorkout(index)"
                        label="Generate Workout"></Button>

                </div>
                <div class="mb-3">
                    <FloatLabel variant="in">
                        <Textarea id="description" :disabled="item.readOnly" v-model="item.description" rows="5"
                            style="width: 100%;" autoResize />
                        <label for="description">Description</label>
                    </FloatLabel>
                </div>

                <div v-if="metconType === 'Custom Workout'" class="flex flex-wrap gap-3">
                    <span>Score:</span>
                    <div v-for="(type, index) in scoreTypes" :key="index">
                        <RadioButton v-model="item.scoreType" :disabled="item.readOnly" :inputId="type" name="dynamic"
                            :value="type" />
                        <label :for="type" class="ml-2">{{ type }}</label>
                    </div>

                </div>
            </div>
            <!-- STRENGTH -->
            <div v-if="item.type === 'Strength'" class="flex flex-wrap gap-3">
                <FloatLabel variant="in">
                    <AutoComplete v-model="item.exercise" @option-select="onSelectedExercise" dropdown optionLabel="name"
                        :disabled="item.readOnly" :suggestions="exercises" @complete="search" />
                    <!-- <InputText id="name" v-model="item.exercise" :disabled="item.readOnly" autocomplete="off" /> -->
                    <label for="name">Exercise</label>
                </FloatLabel>
                <FloatLabel variant="in">
                    <InputNumber v-model="item.sets" inputId="sets" mode="decimal" :disabled="item.readOnly" showButtons
                        :min="0" :max="10" fluid />
                    <label for="sets">Sets</label>
                </FloatLabel>
                <FloatLabel variant="in">
                    <InputNumber v-model="item.reps" inputId="reps" mode="decimal" :disabled="item.readOnly" showButtons
                        :min="0" :max="50" fluid />
                    <label for="reps">Reps</label>
                </FloatLabel>
            </div>
            <div class="flex justify-end mt-2">
                <div v-if="item.type">
                    <Button @click="toggleEdit(index)" :label="item.readOnly ? 'edit' : 'save'" size="small"
                        severity="success" outlined aria-label="Cancel" />
                </div>
                <div>
                    <Button @click="removeExercise(index)" icon="pi pi-trash" severity="danger" text rounded
                        aria-label="Cancel" />
                </div>

            </div>

            <hr class="mt-2">
        </div>
        <Button class="my-3" label="Add Workout Item" @click="addItem"></Button>
        <div class="fixed bottom-0 right-5">
            <Button class="my-3 w-full" :label="isNew ? 'Create Workout' : 'Edit Workout'" @click="createWorkout"></Button>
        </div>

    </Dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import * as yup from 'yup';
import { useWorkoutStore } from '@/stores/workoutStore'
import { computed } from 'vue';
import type { Workout } from '@/models/workout';
import type { WorkoutItem } from '@/models/workoutItem';
import { useForm } from 'vee-validate';

const workoutStore = useWorkoutStore()

const props = defineProps({
    workout: {
        type: Object,
        required: false
    }
});

const schema = yup.object({
    workoutName: yup.string().required('Workout Name is required'),
    date: yup.date().required('Date is required'),
});
// Setup form with Vee Validate
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});


interface WorkoutItemWithReadOnly extends WorkoutItem {
    selectedDuration: ''
    selectedEquipment: []
    readOnly: boolean;
}
const availableEquipment = ref(['Dumbbells', 'Barbell', 'Resistance Bands', 'Kettlebell', 'Bodyweight'])
const metconTypes = ref(['Custom Workout', 'Generated Workout'])
const workoutTypes = ref(['Strength', 'Metcon'])
const scoreTypes = ref(['For Time', 'AMRAP'])
const durations = ref(['Short', 'Medium', 'Long'])

const selectedEquipment = ref([])
const metconType = ref('Custom Workout')
const selectedDuration = ref('')
const workout = ref({} as Workout)
const exercises = ref<any>([])
const workoutItems = ref<WorkoutItemWithReadOnly[]>([]);
const isNew = ref(false)
const emit = defineEmits(["workoutUpdated"]); // Declare event


// 🎯 Watch `props.workout` to detect when editing
watch(() => props.workout, (workoutToEdit: any) => {
    if (workoutToEdit) {
        console.error('edit:', workoutToEdit)
        isNew.value = false;

        // ✅ Create a copy instead of referencing the original object
        workout.value = { ...workoutToEdit };

        // ✅ Map existing workout items to include `readOnly`, `selectedDuration`, and `selectedEquipment`
        workoutItems.value = workoutToEdit.workoutItems.map((item: any) => ({
            ...item,
            readOnly: true, // Default to read-only when editing
            selectedDuration: item.selectedDuration || '',
            selectedEquipment: item.selectedEquipment || [],
        }));
    } else {
        isNew.value = true;
        workoutItems.value = [];
    }
}, { immediate: true });

const search = async (event: any) => {
    console.error('searching')
    if (event.query) {
        setTimeout(async () => {
            exercises.value = await workoutStore.getExercises(event.query)
        }, 250)
    } else {
        exercises.value = await workoutStore.getRecentlySearched()
    }
}

const addItem = () => {
    workoutItems.value.forEach(item => {
        item.readOnly = true;
    });
    const newWorkoutItem = {} as WorkoutItemWithReadOnly
    newWorkoutItem.readOnly = false
    workoutItems.value.push(newWorkoutItem)
}

const typeChange = (index: number) => {
    console.error(workoutItems)
    if (workoutItems.value[index]) {
        workoutItems.value[index].reps = 0
        workoutItems.value[index].sets = 0
        workoutItems.value[index].exercise = {}
        workoutItems.value[index].scoreType = ''
        workoutItems.value[index].description = ''
    }
}
const onSelectedExercise = (exercise: any) => {
    const exerciseToSave = { exerciseId: exercise.value._id, exerciseName: exercise.value.name }
    workoutStore.saveRecentSearch(exerciseToSave)
}

const toggleEdit = (index: number) => {
    // Toggle the readOnly property for the specific item
    workoutItems.value[index].readOnly = !workoutItems.value[index].readOnly;
};

const removeExercise = (index: number) => {
    workoutItems.value.splice(index, 1);
}
const generateWorkout = async (index: number) => {
    workoutItems.value[index].description = await workoutStore.generateWorkout(
        workoutItems.value[index].scoreType,
        workoutItems.value[index].selectedEquipment,
        workoutItems.value[index].selectedDuration)
}


const hideDialog = () => {
    workoutItems.value = []
    workoutStore.showCreateWorkoutDialog()
    // emit('update:visible', false);
};

const createWorkout = () => {
    workout.value.workoutItems = workoutItems.value.filter((item) => item.type).map(({ readOnly, ...item }) => ({
        ...item,
        exercise: item.exercise ? item.exercise._id : null, // Extract the _id from the exercise object
    }))
    if (isNew.value) {
        workoutStore.createWorkout(workout.value)
    } else {
        workoutStore.updateWorkout(workout.value)
        emit("workoutUpdated", { ...workout.value, workoutItems: [...workoutItems.value] }); // Emit event
    }

    if (!isNew.value) {
    }
}


</script>