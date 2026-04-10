<template>
  <div class="space-y-4">
    <!-- Tab switcher -->
    <div class="flex gap-2 border-b border-surface-200 dark:border-surface-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 text-sm font-semibold tracking-wide border-b-2 -mb-px transition-colors duration-150',
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- All Programs -->
    <div v-if="activeTab === 'all'" class="card rounded-lg">
      <DataViewList :items="programs" targetRoute="program" />
    </div>

    <!-- Skill Lab -->
    <div v-else>
      <div v-if="loadingSkill" class="flex justify-center py-12">
        <i class="pi pi-spin pi-spinner text-2xl text-primary" />
      </div>
      <div v-else-if="skillPrograms.length === 0" class="text-center py-12 text-surface-400 text-sm">
        No Skill Lab programs yet.
        <router-link to="/skill-builder" class="text-primary underline">Build one</router-link>.
      </div>
      <div v-else class="card rounded-lg">
        <div
          v-for="(sp, index) in skillPrograms"
          :key="sp._id"
          :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
        >
          <router-link
            :to="{ name: 'skillProgram', params: { id: sp._id } }"
            class="flex items-center py-4 px-2 hover:bg-gray-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-4/12 font-medium text-sm">
              {{ sp.movement }}
            </div>
            <div class="hidden md:block text-surface-400 dark:text-surface-400 w-6/12 text-xs">
              {{ sp.levelTag }} &bull; {{ sp.weeks }} wks &bull; {{ sp.daysPerWeek }}×/wk &bull; {{ sp.timing }}
            </div>
            <div class="w-6/12 md:w-2/12 flex justify-end">
              <Button icon="pi pi-angle-right" text />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DataViewList from '@/components/dataViewList.vue'
import { useProgramStore } from '@/stores/programStore'
import { useSkillProgramStore } from '@/stores/skillProgramStore'
import { useAppStateStore } from '@/stores/appStateStore'
import type { SavedSkillProgram } from '@/stores/skillProgramStore'

const programStore = useProgramStore()
const skillProgramStore = useSkillProgramStore()
const appStateStore = useAppStateStore()

const tabs = [
  { id: 'all', label: 'All Programs' },
  { id: 'skill-lab', label: 'Skill Lab' },
]

const activeTab = ref('all')
const programs = ref([])
const skillPrograms = ref<SavedSkillProgram[]>([])
const loadingSkill = ref(false)

onMounted(async () => {
  appStateStore.setHeaderTitle('Programs')
  programs.value = await programStore.getPrograms()
  loadingSkill.value = true
  skillPrograms.value = await skillProgramStore.getSkillPrograms()
  loadingSkill.value = false
})
</script>
