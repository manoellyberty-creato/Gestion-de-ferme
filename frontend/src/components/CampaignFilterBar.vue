<script setup>
import { ref, onMounted } from 'vue'
import { useCampaignStore } from '@/stores/campaign.store.js'

const store = useCampaignStore()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ search: '', department: '' })
  }
})

const emit = defineEmits(['update:modelValue'])

const updateFilter = (key, value) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

onMounted(async () => {
  // Charger les données si elles ne sont pas déjà disponibles
  if (store.departments.length === 0) {
    await store.fetchDepartments()
  }
})
</script>

<template>
  <div class="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center">
    
    <div class="relative flex-1 w-full">
      <span class="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input 
        type="text" 
        :value="modelValue.search"
        @input="updateFilter('search', $event.target.value)"
        placeholder="Rechercher par nom..." 
        class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
      />
    </div>


    <div class="w-full md:w-auto md:flex-1">
      <select 
        :value="modelValue.department"
        @change="updateFilter('department', $event.target.value)"
        class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
      >
        <option value="">Tous les départements</option>
        <option v-for="dept in store.departments" :key="dept._id" :value="dept._id">{{ dept.name }}</option>
      </select>
    </div>

    <button 
      @click="emit('update:modelValue', { search: '', department: '' })"
      class="text-xs font-bold text-slate-400 hover:text-blue-600 uppercase tracking-tight transition-colors px-3 py-1 hover:bg-slate-100 rounded-lg"
    >
      Réinitialiser
    </button>
  </div>
</template>