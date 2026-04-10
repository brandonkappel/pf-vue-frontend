<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-32 lg:pb-8">

    <!-- Step 1: Category -->
    <section>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">01</span>
        <h2 class="font-semibold text-surface-700 dark:text-surface-300">Movement Category</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)" :class="[
          'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150 text-center',
          selectedCategory === cat.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-600'
        ]">
          <span class="text-2xl">{{ cat.icon }}</span>
          <span class="text-xs font-bold tracking-wide uppercase">{{ cat.name }}</span>
        </button>
      </div>
    </section>

    <!-- Step 2: Movement -->
    <section v-if="selectedCategory">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">02</span>
        <h2 class="font-semibold text-surface-700 dark:text-surface-300">Target Movement</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button v-for="move in currentMovements" :key="move" @click="selectMovement(move)" :class="[
          'px-3 py-2 rounded-lg border-2 text-sm font-semibold tracking-wide transition-all duration-150',
          selectedMovement === move
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300 dark:hover:border-surface-500'
        ]">
          {{ move }}
        </button>
      </div>
    </section>

    <!-- Step 3: Level -->
    <section v-if="selectedMovement">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">03</span>
        <h2 class="font-semibold text-surface-700 dark:text-surface-300">Where Are You Now?</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button v-for="lvl in currentLevels" :key="lvl.id" @click="currentLevel = lvl.id" :class="[
          'flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all duration-150',
          currentLevel === lvl.id
            ? 'border-primary bg-primary/10'
            : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 hover:border-surface-300 dark:hover:border-surface-600'
        ]">
          <span class="text-xs font-black tracking-widest uppercase text-primary">{{ lvl.tag }}</span>
          <span class="text-sm text-surface-500 dark:text-surface-400 leading-snug">{{ lvl.desc }}</span>
        </button>
      </div>
    </section>

    <!-- Step 4: Config -->
    <section v-if="currentLevel">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">04</span>
        <h2 class="font-semibold text-surface-700 dark:text-surface-300">Program Setup</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Program Length</p>
          <div class="flex gap-2">
            <button v-for="w in [4, 6, 8]" :key="w" @click="weeks = w" :class="[
              'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
              weeks === w
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
            ]">{{ w }} wks</button>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">Sessions / Week</p>
          <div class="flex gap-2">
            <button v-for="d in [2, 3, 4, 5]" :key="d" @click="daysPerWeek = d" :class="[
              'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
              daysPerWeek === d
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
            ]">{{ d }}×</button>
          </div>
        </div>

        <div>
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">When to Program</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="t in timingOptions" :key="t" @click="timing = t" :class="[
              'px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all duration-150',
              timing === t
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:border-surface-300'
            ]">{{ t }}</button>
          </div>
        </div>

        <div class="md:col-span-2">
          <p class="text-xs font-bold tracking-widest uppercase text-surface-500 mb-2">
            Notes <span class="normal-case font-normal tracking-normal">(optional)</span>
          </p>
          <Textarea v-model="context" rows="2" class="w-full"
            placeholder="e.g. competing in 8 weeks, shoulder impingement, also training for Hyrox..." autoResize />
        </div>
      </div>
    </section>

    <!-- Generate -->
    <Button v-if="currentLevel" @click="generate" :loading="loading" label="Build My Program" icon="pi pi-bolt"
      class="w-full" size="large" />

    <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

    <!-- Output -->
    <div v-if="programs.length > 0" class="space-y-6">
      <Card v-for="(prog, i) in programs" :key="i">
        <template #title>
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                v{{ i + 1 }}
              </span>
              <span>{{ selectedMovement }} — {{ weeks }}-Week Progression</span>
            </div>
            <div class="flex items-center gap-2">
              <Button v-if="savedIndices.has(i)" label="Saved" icon="pi pi-check" severity="success" outlined
                size="small" disabled />
              <Button v-else label="Save Program" icon="pi pi-bookmark" severity="secondary" outlined size="small"
                @click="save(prog, i)" />
              <Button v-if="i === 0" label="Start Over" severity="secondary" text size="small" @click="reset" />
            </div>
          </div>
        </template>
        <template #content>
          <SkillProgramCard :program="prog" />
        </template>
      </Card>

      <!-- Refine (shown after latest version, max 3 total) -->
      <section v-if="programs.length < 3">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
            {{ programs.length + 1 }}/3
          </span>
          <h2 class="font-semibold text-surface-700 dark:text-surface-300">Refine Your Program</h2>
        </div>
        <Textarea v-model="adjustmentNotes" rows="3" class="w-full mb-3"
          placeholder="e.g. make week 1 easier, add more pulling work, swap EMOMs for straight sets..." autoResize />
        <Button @click="refine" :loading="loading" :disabled="!adjustmentNotes.trim()"
          label="Regenerate with Adjustments" icon="pi pi-refresh" class="w-full" />
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useSkillProgramStore } from '@/stores/skillProgramStore'
import { useAppStateStore } from '@/stores/appStateStore'
import type { SkillProgramData } from '@/stores/skillProgramStore'
import SkillProgramCard from '@/components/SkillProgramCard.vue'

const workoutStore = useWorkoutStore()
const skillProgramStore = useSkillProgramStore()
const appStateStore = useAppStateStore()

onMounted(() => {
  appStateStore.setHeaderTitle('Skill Lab')
})

// ── Data ──────────────────────────────────────────────────────────────────────

const categories = [
  { id: 'gymnastics', name: 'Gymnastics', icon: '🤸' },
  { id: 'weightlifting', name: 'Weightlifting', icon: '🏋️' },
  { id: 'monostructural', name: 'Mono / Cardio', icon: '🏃' },
  { id: 'hyrox', name: 'Hyrox', icon: '⚡' },
]

const movements: Record<string, string[]> = {
  gymnastics: ['Toes to Bar', 'Bar Muscle-Up', 'Ring Muscle-Up', 'Chest-to-Bar Pull-Up', 'Handstand Push-Up', 'Handstand Walk', 'Pistol Squat', 'Double Unders', 'Ring Dip', 'L-Sit'],
  weightlifting: ['Snatch', 'Clean & Jerk', 'Clean', 'Jerk', 'Power Snatch', 'Overhead Squat', 'Front Squat', 'Squat Snatch'],
  monostructural: ['Rowing Technique', 'Ski Erg Efficiency', 'Assault Bike Pacing', 'Running Economy', 'Double Under Consistency'],
  hyrox: ['Sled Push', 'Sled Pull', 'Sandbag Lunges', 'Wall Balls', 'Burpee Broad Jump', 'Rowing (Hyrox)', 'Farmers Carry', 'SkiErg (Hyrox)'],
}

const levelsByMovement: Record<string, { id: string; tag: string; desc: string }[]> = {
  'Toes to Bar': [
    { id: 'zero', tag: 'ZERO REPS', desc: "Can't complete a single rep yet" },
    { id: 'few', tag: '1–5 REPS', desc: 'Have a few but inconsistent' },
    { id: 'sets', tag: '6–15 REPS', desc: 'Can do small sets, breaking early' },
    { id: 'efficient', tag: '15+ REPS', desc: 'Have the reps, want efficiency & cycling' },
  ],
  'Bar Muscle-Up': [
    { id: 'zero', tag: 'NO BMU', desc: 'No muscle-ups yet' },
    { id: 'strict', tag: 'STRICT ONLY', desc: 'Have strict, no kipping yet' },
    { id: 'few', tag: '1–3 KIPPING', desc: 'A few kipping reps but inconsistent' },
    { id: 'sets', tag: 'SETS OF 3+', desc: 'Have them, want to string and cycle' },
  ],
  default: [
    { id: 'beginner', tag: 'BEGINNER', desc: 'New to this movement' },
    { id: 'developing', tag: 'DEVELOPING', desc: 'Have basics, inconsistent' },
    { id: 'intermediate', tag: 'INTERMEDIATE', desc: 'Solid foundation, want to improve' },
    { id: 'advanced', tag: 'ADVANCED', desc: 'Proficient, chasing efficiency' },
  ],
}

const timingOptions = ['Pre-WOD', 'Post-WOD', 'Standalone']

// ── State ─────────────────────────────────────────────────────────────────────

const selectedCategory = ref('')
const selectedMovement = ref('')
const currentLevel = ref('')
const weeks = ref(6)
const daysPerWeek = ref(3)
const timing = ref('Pre-WOD')
const context = ref('')
const programs = ref<SkillProgramData[]>([])
const savedIndices = ref<Set<number>>(new Set())
const adjustmentNotes = ref('')
const loading = ref(false)
const error = ref('')

// ── Computed ──────────────────────────────────────────────────────────────────

const currentMovements = computed(() => movements[selectedCategory.value] ?? [])
const currentLevels = computed(() => levelsByMovement[selectedMovement.value] ?? levelsByMovement.default)

// ── Actions ───────────────────────────────────────────────────────────────────

const selectCategory = (id: string) => {
  selectedCategory.value = id
  selectedMovement.value = ''
  currentLevel.value = ''
  programs.value = []
  savedIndices.value = new Set()
}

const selectMovement = (move: string) => {
  selectedMovement.value = move
  currentLevel.value = ''
  programs.value = []
  savedIndices.value = new Set()
}

const generate = async () => {
  loading.value = true
  error.value = ''
  programs.value = []
  savedIndices.value = new Set()
  const level = currentLevels.value.find(l => l.id === currentLevel.value)
  try {
    const result = await workoutStore.generateSkillProgram({
      category: selectedCategory.value,
      movement: selectedMovement.value,
      levelTag: level?.tag ?? '',
      levelDesc: level?.desc ?? '',
      weeks: weeks.value,
      daysPerWeek: daysPerWeek.value,
      timing: timing.value,
      context: context.value,
    })
    console.log('Generated program:', result)
    programs.value.push(result)
  } catch {
    error.value = 'Failed to generate program. Please try again.'
  } finally {
    loading.value = false
  }
}

const refine = async () => {
  loading.value = true
  error.value = ''
  const level = currentLevels.value.find(l => l.id === currentLevel.value)
  try {
    const result = await workoutStore.refineSkillProgram({
      previousProgram: JSON.stringify(programs.value[programs.value.length - 1]),
      adjustmentNotes: adjustmentNotes.value,
      movement: selectedMovement.value,
      levelTag: level?.tag ?? '',
      levelDesc: level?.desc ?? '',
      weeks: weeks.value,
      daysPerWeek: daysPerWeek.value,
      timing: timing.value,
    })
    programs.value.push(result)
    adjustmentNotes.value = ''
  } catch {
    error.value = 'Failed to refine program. Please try again.'
  } finally {
    loading.value = false
  }
}

const save = async (prog: SkillProgramData, index: number) => {
  const level = currentLevels.value.find(l => l.id === currentLevel.value)
  try {
    await skillProgramStore.saveSkillProgram({
      movement: selectedMovement.value,
      levelTag: level?.tag ?? '',
      levelDesc: level?.desc ?? '',
      timing: timing.value,
      weeks: weeks.value,
      daysPerWeek: daysPerWeek.value,
      overview: prog.overview,
      prerequisiteMovements: prog.prerequisiteMovements,
      program: prog.weeks,
      benchmarks: prog.benchmarks,
      coachNotes: prog.coachNotes,
    })
    savedIndices.value = new Set([...savedIndices.value, index])
  } catch {
    error.value = 'Failed to save program. Please try again.'
  }
}

const reset = () => {
  selectedCategory.value = ''
  selectedMovement.value = ''
  currentLevel.value = ''
  weeks.value = 6
  daysPerWeek.value = 3
  timing.value = 'Pre-WOD'
  context.value = ''
  programs.value = []
  savedIndices.value = new Set()
  adjustmentNotes.value = ''
  error.value = ''
}
</script>
