<template>
  <div class="bg-white rounded-lg shadow p-4 space-y-4">
    <h3 class="font-semibold text-gray-900">Filtres</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Type -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          v-model="localFilters.type"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="">Tous</option>
          <option value="income">Revenu</option>
          <option value="expense">Dépense</option>
        </select>
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
        <input
          v-model="localFilters.category"
          type="text"
          placeholder="Rechercher..."
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date Début</label>
        <input
          v-model="localFilters.startDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Date Fin</label>
        <input
          v-model="localFilters.endDate"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>
    </div>

    <!-- Buttons -->
    <div class="flex gap-2 pt-2">
      <button
        @click="applyFilters"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
      >
        Appliquer
      </button>
      <button
        @click="resetFilters"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
      >
        Réinitialiser
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update'])

const localFilters = ref({
  type: '',
  category: '',
  startDate: '',
  endDate: ''
})

watch(() => props.filters, (newVal) => {
  localFilters.value = { ...newVal }
}, { immediate: true })

const applyFilters = () => {
  emit('update', { ...localFilters.value })
}

const resetFilters = () => {
  localFilters.value = {
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  }
  emit('update', {})
}
</script>
