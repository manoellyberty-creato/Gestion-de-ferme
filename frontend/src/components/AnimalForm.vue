<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6 border-b border-slate-200">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-slate-800">Ajouter des Animaux</h2>
          <button @click="$emit('close')" class="text-slate-400 hover:text-slate-600">
            <span class="text-2xl">×</span>
          </button>
        </div>
      </div>

      <div class="p-6 space-y-6">
        <!-- Mode Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-700">Mode d'ajout</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="addMode" type="radio" value="individual" class="text-blue-600">
              <span class="text-sm">Ajout individuel</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="addMode" type="radio" value="bulk" class="text-blue-600">
              <span class="text-sm">Ajout en masse</span>
            </label>
          </div>
        </div>

        <!-- Species Selection -->
        <div class="space-y-3">
          <label class="block text-sm font-semibold text-slate-700">Espèce *</label>
          <select v-model="selectedSpecies" required
            class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Sélectionner une espèce</option>
            <option v-for="category in campaignSpeciesCategories" :key="category.name" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Individual Add Form -->
        <div v-if="addMode === 'individual'" class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-800">Ajouter un animal</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Nom</label>
              <input v-model="individualForm.name" type="text"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Numéro de tag *</label>
              <input v-model="individualForm.tagNumber" type="text" required
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Poids initial (kg) *</label>
              <input v-model.number="individualForm.initialWeight" type="number" step="0.1" min="0" required
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Date de naissance *</label>
              <input v-model="individualForm.dateOfBirth" type="date" required
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>

          <button @click="addIndividualAnimal" :disabled="loading || !isIndividualFormValid"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Ajout en cours...</span>
            <span v-else>Ajouter l'animal</span>
          </button>
        </div>

        <!-- Bulk Add Form -->
        <div v-if="addMode === 'bulk'" class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-800">Ajouter en masse</h3>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Nombre d'animaux *</label>
            <input v-model.number="bulkForm.count" type="number" min="1" max="100" required
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Préfixe du tag</label>
            <input v-model="bulkForm.tagPrefix" type="text" placeholder="ex: LOT001"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Poids initial moyen (kg) *</label>
              <input v-model.number="bulkForm.averageWeight" type="number" step="0.1" min="0" required
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Écart type du poids (kg)</label>
              <input v-model.number="bulkForm.weightVariation" type="number" step="0.1" min="0" :max="bulkForm.averageWeight"
                class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>

          <button @click="addBulkAnimals" :disabled="loading || !isBulkFormValid"
            class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="loading">Ajout en cours...</span>
            <span v-else>Ajouter {{ bulkForm.count }} animaux</span>
          </button>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message" :class="messageType === 'success' ? 'text-green-600' : 'text-red-600'" class="text-sm text-center">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAnimalStore } from '@/stores/animal.store'

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  },
  campaign: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'animal-added'])

const animalStore = useAnimalStore()

const addMode = ref('individual')
const selectedSpecies = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('')

const individualForm = ref({
  name: '',
  tagNumber: '',
  initialWeight: null,
  dateOfBirth: new Date().toISOString().split('T')[0]
})

const bulkForm = ref({
  count: 1,
  tagPrefix: '',
  averageWeight: null,
  weightVariation: 0
})

const campaignSpeciesCategories = computed(() => {
  return props.campaign?.speciesCategories || []
})

const isIndividualFormValid = computed(() => {
  return selectedSpecies.value &&
         individualForm.value.tagNumber &&
         individualForm.value.initialWeight > 0 &&
         individualForm.value.dateOfBirth
})

const isBulkFormValid = computed(() => {
  return selectedSpecies.value &&
         bulkForm.value.count > 0 &&
         bulkForm.value.averageWeight > 0
})

const addIndividualAnimal = async () => {
  if (!isIndividualFormValid.value) return

  loading.value = true
  message.value = ''

  try {
    const animalData = {
      campaign: props.campaignId,
      species: selectedSpecies.value,
      name: individualForm.value.name,
      tagNumber: individualForm.value.tagNumber,
      initialWeight: individualForm.value.initialWeight,
      currentWeight: individualForm.value.initialWeight,
      dateOfBirth: individualForm.value.dateOfBirth,
      entryDate: new Date().toISOString()
    }

    const result = await animalStore.createNewAnimal(animalData)

    if (result.success) {
      message.value = 'Animal ajouté avec succès!'
      messageType.value = 'success'

      // Reset form
      individualForm.value = {
        name: '',
        tagNumber: '',
        initialWeight: null,
        dateOfBirth: new Date().toISOString().split('T')[0]
      }

      emit('animal-added')
    } else {
      message.value = result.error
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = 'Erreur lors de l\'ajout de l\'animal'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

const addBulkAnimals = async () => {
  if (!isBulkFormValid.value) return

  loading.value = true
  message.value = ''

  try {
    const animals = []
    const startNumber = bulkForm.value.tagPrefix ? 1 : 1

    for (let i = 0; i < bulkForm.value.count; i++) {
      // Generate weight with variation
      const weightVariation = (Math.random() - 0.5) * 2 * bulkForm.value.weightVariation
      const weight = Math.max(0.1, bulkForm.value.averageWeight + weightVariation)

      const tagNumber = bulkForm.value.tagPrefix
        ? `${bulkForm.value.tagPrefix}-${String(startNumber + i).padStart(3, '0')}`
        : `AUTO-${Date.now()}-${i}`

      animals.push({
        campaign: props.campaignId,
        species: selectedSpecies.value,
        name: `${selectedSpecies.value} ${startNumber + i}`,
        tagNumber: tagNumber,
        initialWeight: weight,
        currentWeight: weight,
        dateOfBirth: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date within last year
        entryDate: new Date().toISOString()
      })
    }

    // Add animals one by one (could be optimized with batch endpoint)
    let successCount = 0
    for (const animal of animals) {
      try {
        await animalStore.createNewAnimal(animal)
        successCount++
      } catch (error) {
        console.error('Error adding animal:', error)
      }
    }

    if (successCount > 0) {
      message.value = `${successCount} animaux ajoutés avec succès!`
      messageType.value = 'success'
      emit('animal-added')
    } else {
      message.value = 'Erreur lors de l\'ajout des animaux'
      messageType.value = 'error'
    }

  } catch (error) {
    message.value = 'Erreur lors de l\'ajout des animaux'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

watch(selectedSpecies, () => {
  message.value = ''
})
</script>