<template>
  <div class="space-y-4">
    <div v-for="(item, index) in workout.workoutItems" :key="item._id || index"
      class="rounded-xl border-2 border-surface-200 dark:border-surface-700 overflow-hidden">
      <!-- Item header -->
      <div class="flex items-center gap-3 px-4 py-3 bg-surface-50 dark:bg-surface-800">
        <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-bold tracking-widest uppercase text-surface-400">
            {{ item.type }}<span v-if="item.scoreType"> · {{ item.scoreType }}</span>
          </p>
          <p class="text-sm font-semibold text-surface-700 dark:text-surface-200 truncate">
            <template v-if="item.type === 'Strength'">
              {{ item.exercise?.name || item.customExercise || '—' }}
              <span class="font-normal text-surface-400"> · {{ item.sets }} sets × {{ item.reps }} reps</span>
            </template>
            <template v-else>
              {{ item.description?.slice(0, 60) }}{{ item.description?.length > 60 ? '…' : '' }}
            </template>
          </p>
        </div>
        <span v-if="savedItems.has(index)"
          class="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1 flex-shrink-0">
          <i class="pi pi-check" /> Logged
        </span>
      </div>

      <!-- Metcon full description -->
      <div v-if="item.type === 'Metcon' && item.description" class="px-4 pt-3">
        <pre class="whitespace-pre-wrap font-sans text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{{
          item.description }}</pre>
      </div>

      <!-- Result inputs -->
      <div class="px-4 pb-4 pt-3 space-y-4">
        <p class="text-xs font-bold tracking-widest uppercase text-surface-500">Log Your Result</p>

        <!-- ── STRENGTH ── -->
        <template v-if="item.type === 'Strength'">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="text-xs font-bold tracking-widest uppercase text-surface-400 pb-2 text-left pr-4 w-10">Set
                  </th>
                  <th class="text-xs font-bold tracking-widest uppercase text-surface-400 pb-2 text-left pr-4">Weight
                  </th>
                  <th class="text-xs font-bold tracking-widest uppercase text-surface-400 pb-2 text-left">Reps</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(set, si) in getStrengthResult(index).sets" :key="si" class="align-middle">
                  <td class="pr-4 py-1.5">
                    <span class="text-xs font-bold text-surface-400">{{ si + 1 }}</span>
                  </td>
                  <td class="pr-3 py-1.5">
                    <div class="flex items-center">
                      <InputNumber v-model="set.weight" :min="0" :max="2000" :step="5" class="w-24" inputClass="text-sm"
                        placeholder="0" :useGrouping="false" />
                      <span class="text-xs text-surface-400">lbs</span>
                    </div>
                  </td>
                  <td class="py-1.5">
                    <InputNumber v-model="set.actualReps" :min="0" :max="200" class="w-16" inputClass="text-sm"
                      :placeholder="String(item.reps || 0)" :useGrouping="false" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">
              RPE <span class="normal-case font-normal tracking-normal text-surface-400">(how hard, 1–10)</span>
            </p>
            <div class="flex gap-2 flex-wrap">
              <button v-for="n in [6, 7, 7.5, 8, 8.5, 9, 9.5, 10]" :key="n"
                @click="getStrengthResult(index).rpe = getStrengthResult(index).rpe === n ? null : n" :class="[
                  'px-3 py-1.5 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                  getStrengthResult(index).rpe === n
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-500 hover:border-surface-300'
                ]">{{ n }}</button>
            </div>
          </div>
        </template>

        <!-- ── FOR TIME ── -->
        <template v-else-if="item.scoreType === 'For Time'">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Finishing Time</p>
            <div class="flex items-center gap-2">
              <div class="w-16 flex-shrink-0">
                <InputNumber v-model="getForTimeResult(index).minutes" :min="0" :max="99" fluid
                  inputClass="text-center text-lg font-bold w-full" placeholder="00" :useGrouping="false" />
              </div>
              <span class="text-xl font-bold text-surface-400 flex-shrink-0">:</span>
              <div class="w-16 flex-shrink-0">
                <InputNumber v-model="getForTimeResult(index).seconds" :min="0" :max="59" fluid
                  inputClass="text-center text-lg font-bold w-full" placeholder="00" :useGrouping="false" />
              </div>
              <span class="text-sm text-surface-400 flex-shrink-0">min : sec</span>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Scale</p>
            <div class="flex gap-2">
              <button v-for="s in ['Rx', 'Rx+', 'Scaled']" :key="s"
                @click="getForTimeResult(index).scale = getForTimeResult(index).scale === s ? '' : s" :class="[
                  'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                  getForTimeResult(index).scale === s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-500 hover:border-surface-300'
                ]">{{ s }}</button>
            </div>
          </div>
        </template>

        <!-- ── AMRAP ── -->
        <template v-else-if="item.scoreType === 'AMRAP'">
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Score</p>
            <div class="flex items-center gap-3 flex-wrap">
              <div class="flex flex-col gap-1">
                <span class="text-xs text-surface-400">Rounds</span>
                <InputNumber v-model="getAmrapResult(index).rounds" :min="0" :max="999" class="w-20"
                  inputClass="text-center text-lg font-bold" placeholder="0" :useGrouping="false" />
              </div>
              <span class="text-xl font-bold text-surface-400 self-end mb-1">+</span>
              <div class="flex flex-col gap-1">
                <span class="text-xs text-surface-400">Extra Reps</span>
                <InputNumber v-model="getAmrapResult(index).extraReps" :min="0" :max="999" class="w-20"
                  inputClass="text-center text-lg font-bold" placeholder="0" :useGrouping="false" />
              </div>
            </div>
          </div>
          <div>
            <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Scale</p>
            <div class="flex gap-2">
              <button v-for="s in ['Rx', 'Rx+', 'Scaled']" :key="s"
                @click="getAmrapResult(index).scale = getAmrapResult(index).scale === s ? '' : s" :class="[
                  'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
                  getAmrapResult(index).scale === s
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-500 hover:border-surface-300'
                ]">{{ s }}</button>
            </div>
          </div>
        </template>

        <!-- Notes (all types) -->
        <div>
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">
            Notes <span class="normal-case font-normal tracking-normal text-surface-400">(optional)</span>
          </p>
          <Textarea :modelValue="getNotes(index)" @update:modelValue="val => setNotes(index, val)" rows="2"
            class="w-full" autoResize placeholder="How did it feel? PRs, breakdowns, things to note..." />
        </div>

        <Button @click="saveResult(index)" :label="savedItems.has(index) ? 'Update Result' : 'Log Result'"
          :icon="savedItems.has(index) ? 'pi pi-refresh' : 'pi pi-save'"
          :severity="savedItems.has(index) ? 'secondary' : 'primary'" outlined class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'

const workoutStore = useWorkoutStore()
const workout = computed(() => workoutStore.workout)
const savedItems = ref<Set<number>>(new Set())

// ── Types ─────────────────────────────────────────────────────────────────────

interface StrengthSet { weight: number | null; actualReps: number | null }
interface StrengthResult { sets: StrengthSet[]; rpe: number | null; notes: string }
interface ForTimeResult { minutes: number | null; seconds: number | null; scale: string; notes: string }
interface AmrapResult { rounds: number | null; extraReps: number | null; scale: string; notes: string }

const strengthResults = reactive<Record<number, StrengthResult>>({})
const forTimeResults = reactive<Record<number, ForTimeResult>>({})
const amrapResults = reactive<Record<number, AmrapResult>>({})

// Find saved result for a workout item from myResults (WorkoutResults doc)
const getSavedItemResult = (item: any) => {
  const myResults = (workout.value as any).myResults
  return myResults?.workoutItemsResults?.find(
    (r: any) => String(r.workoutItemId) === String(item._id)
  ) ?? null
}

// ── Lazy-init accessors (pre-populated from WorkoutResults) ────────────────────

const getStrengthResult = (i: number): StrengthResult => {
  if (!strengthResults[i]) {
    const item = workout.value.workoutItems?.[i]
    const saved = getSavedItemResult(item)
    strengthResults[i] = reactive({
      sets: saved?.setsResults?.map((s: any) => ({ weight: s.weight ?? null, actualReps: s.reps ?? null }))
        ?? Array.from({ length: item?.sets || 1 }, () => ({ weight: null, actualReps: null })),
      rpe: saved?.rpe ?? null,
      notes: saved?.notes ?? '',
    })
    if (saved) savedItems.value = new Set([...savedItems.value, i])
  }
  return strengthResults[i]
}

const getForTimeResult = (i: number): ForTimeResult => {
  if (!forTimeResults[i]) {
    const item = workout.value.workoutItems?.[i]
    const saved = getSavedItemResult(item)
    const savedSet = saved?.setsResults?.[0]
    forTimeResults[i] = reactive({
      minutes: savedSet?.time != null ? Math.floor(savedSet.time / 60) : null,
      seconds: savedSet?.time != null ? savedSet.time % 60 : null,
      scale: savedSet?.scale ?? '',
      notes: saved?.notes ?? '',
    })
    if (saved) savedItems.value = new Set([...savedItems.value, i])
  }
  return forTimeResults[i]
}

const getAmrapResult = (i: number): AmrapResult => {
  if (!amrapResults[i]) {
    const item = workout.value.workoutItems?.[i]
    const saved = getSavedItemResult(item)
    const savedSet = saved?.setsResults?.[0]
    amrapResults[i] = reactive({
      rounds: savedSet?.reps ?? null,
      extraReps: savedSet?.extraReps ?? null,
      scale: savedSet?.scale ?? '',
      notes: saved?.notes ?? '',
    })
    if (saved) savedItems.value = new Set([...savedItems.value, i])
  }
  return amrapResults[i]
}

const getNotes = (i: number): string => {
  const item = workout.value.workoutItems?.[i]
  if (!item) return ''
  if (item.type === 'Strength') return getStrengthResult(i).notes
  if (item.scoreType === 'For Time') return getForTimeResult(i).notes
  if (item.scoreType === 'AMRAP') return getAmrapResult(i).notes
  return ''
}

const setNotes = (i: number, val: string) => {
  const item = workout.value.workoutItems?.[i]
  if (!item) return
  if (item.type === 'Strength') getStrengthResult(i).notes = val
  else if (item.scoreType === 'For Time') getForTimeResult(i).notes = val
  else if (item.scoreType === 'AMRAP') getAmrapResult(i).notes = val
}

// ── Save ───────────────────────────────────────────────────────────────────────

const saveResult = async (i: number) => {
  const item = workout.value.workoutItems?.[i]
  if (!item) return

  let setsResults: any[] = []
  let rpe: number | null = null
  let notes = ''

  if (item.type === 'Strength') {
    const r = getStrengthResult(i)
    setsResults = r.sets.map((s, si) => ({ setNumber: si + 1, weight: s.weight, reps: s.actualReps }))
    rpe = r.rpe
    notes = r.notes
  } else if (item.scoreType === 'For Time') {
    const r = getForTimeResult(i)
    const totalSeconds = ((r.minutes ?? 0) * 60) + (r.seconds ?? 0)
    setsResults = [{ setNumber: 1, time: totalSeconds, scale: r.scale }]
    notes = r.notes
  } else if (item.scoreType === 'AMRAP') {
    const r = getAmrapResult(i)
    setsResults = [{ setNumber: 1, reps: r.rounds, extraReps: r.extraReps, scale: r.scale }]
    notes = r.notes
  }

  await workoutStore.saveItemResult(workout.value._id, {
    workoutItemId: item._id,
    exercise: item.exercise?._id ?? item.exercise ?? null,
    customExercise: item.customExercise ?? null,
    setsResults,
    rpe,
    notes,
  })
  savedItems.value = new Set([...savedItems.value, i])
}
</script>
