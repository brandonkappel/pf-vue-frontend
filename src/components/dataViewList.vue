<template>
    <div class="card rounded-lg">
        <DataView :value="items" layout="list" :paginator="true" :rows="10">
            <template #list>
                <div v-for="(item, index) in items" :key="index" class="p-col-12">
                    <div class="hover:bg-gray-200 dark:hover:bg-slate-800 cursor-pointer"
                        :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                        <router-link :to="{ name: targetRoute, params: { id: item._id } }"
                            class="flex items-center py-4 px-2 border-t border-surface flex-wrap">
                            <!-- Customize how you want each item to be displayed -->
                            <div class="text-surface-500 dark:text-surface-300 w-6/12 md:w-2/12 font-medium">
                                <p v-if="item.name">{{
                                    item.name }}</p>
                            </div>
                            <div class="text-surface-900 dark:text-surface-0 w-full md:w-8/12 md:order-none order-1">
                                <p v-if="item.date">{{
                                    formatDate(item.date) }}</p>
                            </div>
                            <div class="w-6/12 md:w-2/12 flex justify-end">
                                <Button icon="pi pi-angle-right" text />
                            </div>
                            <!-- <div class="p-grid">
   
                                <div class="p-col-12 p-md-9">
                                    <h5 class="text-lg font-medium mt-2">{{ item.name }}</h5>
                                    <p>{{ formatDate(item.date) }}</p>
                                </div>
                            </div> -->
                        </router-link>
                    </div>
                </div>
            </template>
        </DataView>
    </div>
</template>
  
<script setup>
import { defineProps } from 'vue';
import { formatDate } from '@/shared/formatter'

const props = defineProps({
    items: {
        type: Array,
        required: true
    },
    targetRoute: {
        type: String,
        required: true
    }
});
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
  