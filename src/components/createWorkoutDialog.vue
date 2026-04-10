<template>
  <Dialog
    :visible="workoutStore.isCreateWorkoutDialogVisible"
    modal
    @update:visible="hideDialog"
    :header="workout ? workout.name || 'New Workout' : 'New Workout'"
    :style="{ width: '75vw', maxWidth: '720px' }"
    :breakpoints="{ '1199px': '85vw', '575px': '95vw' }"
    pt:mask:class="backdrop-blur-sm"
  >
    <div class="space-y-6 pb-20">

      <!-- Name + Date -->
      <section>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Workout Name</p>
            <InputText v-model="workout.name" placeholder="e.g. Monday Strength + Metcon" class="w-full" />
          </div>
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Date</p>
            <DatePicker v-model="workout.date" inputId="date" showIcon iconDisplay="input" class="w-full" />
          </div>
        </div>
      </section>

      <hr class="border-surface-200 dark:border-surface-700" />

      <!-- Workout Items -->
      <section class="space-y-4">
        <div v-for="(item, index) in workoutItems" :key="index"
          class="rounded-xl border-2 border-surface-200 dark:border-surface-700 overflow-hidden">

          <!-- Item header -->
          <div class="flex items-center justify-between px-4 py-3 bg-surface-50 dark:bg-surface-800">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="text-sm font-semibold text-surface-600 dark:text-surface-300">
                {{ item.type || 'Select Type' }}
                <span v-if="item.type === 'Strength' && item.exercise?.name"> — {{ item.exercise.name }}</span>
                <span v-if="item.type === 'Metcon' && item.description"> — {{ item.description.slice(0, 40) }}...</span>
              </span>
            </div>
            <div class="flex items-center gap-1">
              <Button
                v-if="item.type"
                @click="toggleEdit(index)"
                :label="item.readOnly ? 'Edit' : 'Done'"
                :icon="item.readOnly ? 'pi pi-pencil' : 'pi pi-check'"
                :severity="item.readOnly ? 'secondary' : 'success'"
                size="small"
                outlined
              />
              <Button
                @click="removeExercise(index)"
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                size="small"
              />
            </div>
          </div>

          <!-- Item body -->
          <div v-if="!item.readOnly" class="px-4 py-4 space-y-4">

            <!-- Type selector -->
            <div>
              <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Type</p>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="type in workoutTypes"
                  :key="type"
                  @click="item.type = type; typeChange(index)"
                  :class="[
                    'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                    item.type === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                  ]"
                >{{ type }}</button>
              </div>
            </div>

            <!-- STRENGTH -->
            <div v-if="item.type === 'Strength'" class="space-y-4">
              <div>
                <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Exercise</p>
                <AutoComplete
                  v-model="item.exercise"
                  @option-select="onSelectedExercise"
                  dropdown
                  optionLabel="name"
                  :suggestions="exercises"
                  @complete="search"
                  class="w-full"
                  placeholder="Search exercises..."
                />
              </div>
              <div class="flex gap-4">
                <div class="flex-1">
                  <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Sets</p>
                  <InputNumber v-model="item.sets" inputId="sets" mode="decimal" showButtons :min="0" :max="10" fluid />
                </div>
                <div class="flex-1">
                  <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Reps</p>
                  <InputNumber v-model="item.reps" inputId="reps" mode="decimal" showButtons :min="0" :max="50" fluid />
                </div>
              </div>
            </div>

            <!-- METCON -->
            <div v-if="item.type === 'Metcon'" class="space-y-4">

              <!-- Custom vs Generate -->
              <div>
                <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Build Method</p>
                <div class="flex gap-2">
                  <button
                    v-for="mt in metconTypes"
                    :key="mt"
                    @click="metconType = mt"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                      metconType === mt
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                    ]"
                  >{{ mt }}</button>
                </div>
              </div>

              <!-- Generate options -->
              <div v-if="metconType === 'Generated Workout'" class="space-y-4">
                <div>
                  <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Equipment</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="eq in availableEquipment"
                      :key="eq"
                      @click="toggleEquipment(item, eq)"
                      :class="[
                        'px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                        item.selectedEquipment?.includes(eq)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                      ]"
                    >{{ eq }}</button>
                  </div>
                </div>

                <div>
                  <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Score Type</p>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      v-for="type in scoreTypes"
                      :key="type"
                      @click="item.scoreType = type"
                      :class="[
                        'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                        item.scoreType === type
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                      ]"
                    >{{ type }}</button>
                  </div>
                </div>

                <div>
                  <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Duration</p>
                  <div class="flex gap-2">
                    <button
                      v-for="d in durations"
                      :key="d"
                      @click="item.selectedDuration = d"
                      :class="[
                        'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                        item.selectedDuration === d
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                      ]"
                    >{{ d }}</button>
                  </div>
                </div>

                <Button
                  @click="generateWorkout(index)"
                  label="Generate Workout"
                  icon="pi pi-bolt"
                  class="w-full"
                />
              </div>

              <!-- Custom score type -->
              <div v-if="metconType === 'Custom Workout'">
                <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Score Type</p>
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="type in scoreTypes"
                    :key="type"
                    @click="item.scoreType = type"
                    :class="[
                      'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                      item.scoreType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
                    ]"
                  >{{ type }}</button>
                </div>
              </div>

              <!-- Description -->
              <div>
                <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Description</p>
                <Textarea v-model="item.description" rows="4" class="w-full" autoResize
                  placeholder="e.g. 21-15-9 Thrusters (95/65) + Pull-ups" />
              </div>
            </div>
          </div>

          <!-- Read-only summary -->
          <div v-else-if="item.type" class="px-4 py-3 text-sm text-surface-500 dark:text-surface-400">
            <template v-if="item.type === 'Strength'">
              <span class="font-semibold text-surface-700 dark:text-surface-200">{{ item.exercise?.name || '—' }}</span>
              {{ item.sets }} sets × {{ item.reps }} reps
            </template>
            <template v-else>
              <span class="font-semibold text-primary">{{ item.scoreType || 'Metcon' }}</span>
              <span v-if="item.description" class="ml-1">— {{ item.description.slice(0, 80) }}{{ item.description.length > 80 ? '...' : '' }}</span>
            </template>
          </div>

        </div>

        <Button
          label="Add Workout Item"
          icon="pi pi-plus"
          severity="secondary"
          outlined
          class="w-full"
          @click="addItem"
        />
      </section>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" severity="secondary" text @click="hideDialog" />
        <Button
          :label="isNew ? 'Create Workout' : 'Save Changes'"
          icon="pi pi-check"
          @click="createWorkout"
        />
      </div>
    </template>
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
const { defineField, handleSubmit, errors } = useForm({
    validationSchema: schema,
});

interface WorkoutItemWithReadOnly extends WorkoutItem {
    selectedDuration: ''
    selectedEquipment: string[]
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
const emit = defineEmits(["workoutUpdated"]);

watch(() => props.workout, (workoutToEdit: any) => {
    if (workoutToEdit) {
        isNew.value = false;
        workout.value = { ...workoutToEdit };
        workoutItems.value = workoutToEdit.workoutItems.map((item: any) => ({
            ...item,
            readOnly: true,
            selectedDuration: item.selectedDuration || '',
            selectedEquipment: item.selectedEquipment || [],
        }));
    } else {
        isNew.value = true;
        workoutItems.value = [];
        workout.value = { date: new Date(), name: '' } as Workout;
    }
}, { immediate: true });

const search = async (event: any) => {
    if (event.query) {
        setTimeout(async () => {
            exercises.value = await workoutStore.getExercises(event.query)
        }, 250)
    } else {
        exercises.value = await workoutStore.getRecentlySearched()
    }
}

const toggleEquipment = (item: WorkoutItemWithReadOnly, eq: string) => {
    if (!item.selectedEquipment) item.selectedEquipment = []
    const idx = item.selectedEquipment.indexOf(eq)
    if (idx === -1) {
        item.selectedEquipment.push(eq)
    } else {
        item.selectedEquipment.splice(idx, 1)
    }
}

const addItem = () => {
    workoutItems.value.forEach(item => { item.readOnly = true; });
    const newWorkoutItem = {} as WorkoutItemWithReadOnly
    newWorkoutItem.readOnly = false
    newWorkoutItem.selectedEquipment = []
    workoutItems.value.push(newWorkoutItem)
}

const typeChange = (index: number) => {
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
};

const createWorkout = () => {
    if (!workout.value.name?.trim()) {
        const d = workout.value.date ? new Date(workout.value.date) : new Date();
        workout.value.name = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    }
    workout.value.workoutItems = workoutItems.value.filter((item) => item.type).map(({ readOnly, ...item }) => ({
        ...item,
        exercise: item.exercise ? item.exercise._id : null,
    }))
    if (isNew.value) {
        workoutStore.createWorkout(workout.value)
    } else {
        workoutStore.updateWorkout(workout.value)
        emit("workoutUpdated", { ...workout.value, workoutItems: [...workoutItems.value] });
    }
}
</script>
