<template>
  <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow-md p-6 space-y-4">
    <!-- Animal ID -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner un animal *</label>
      <input
        v-model="formData.animalId"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="ID de l'animal"
      />
    </div>

    <!-- Produit -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Sélectionner un produit *</label>
      <select
        v-model="formData.productId"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Choisir un produit</option>
        <option v-for="product in healthStore.products" :key="product._id" :value="product._id">
          {{ product.name }} ({{ product.type }})
        </option>
      </select>
    </div>

    <!-- Dosage et Unité -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Dosage *</label>
        <input
          v-model.number="formData.dosage"
          type="number"
          required
          min="0"
          step="0.1"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="500"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Unité *</label>
        <select
          v-model="formData.unit"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choisir une unité</option>
          <option value="ml">Millilitres (ml)</option>
          <option value="mg">Milligrammes (mg)</option>
          <option value="units">Unités</option>
          <option value="doses">Doses</option>
        </select>
      </div>
    </div>

    <!-- Fréquence et Durée -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Fréquence *</label>
        <select
          v-model="formData.frequency"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choisir une fréquence</option>
          <option value="daily">Quotidien</option>
          <option value="weekly">Hebdomadaire</option>
          <option value="biweekly">Bi-hebdomadaire</option>
          <option value="monthly">Mensuel</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Durée (jours) *</label>
        <input
          v-model.number="formData.duration"
          type="number"
          required
          min="1"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="7"
        />
      </div>
    </div>

    <!-- Date de début -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
      <input
        v-model="formData.startDate"
        type="date"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Notes</label>
      <textarea
        v-model="formData.notes"
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Notes supplémentaires..."
      ></textarea>
    </div>

    <!-- Boutons -->
    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="isLoading"
        class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors font-medium"
      >
        {{ isLoading ? 'En cours...' : isEdit ? 'Mettre à jour' : 'Créer' }}
      </button>
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-md hover:bg-gray-400 transition-colors font-medium"
      >
        Annuler
      </button>
    </div>

    <!-- Message d'erreur -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { useHealth } from '../../stores/useHealth'

const props = defineProps({
  prescription: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['cancel', 'success'])

const healthStore = useHealth()
const isLoading = ref(false)
const error = ref(null)
const isEdit = ref(!!props.prescription)

const formData = ref({
  animalId: props.prescription?.animalId || '',
  productId: props.prescription?.productId || '',
  dosage: props.prescription?.dosage || 0,
  unit: props.prescription?.unit || 'ml',
  frequency: props.prescription?.frequency || '',
  duration: props.prescription?.duration || 7,
  startDate: props.prescription?.startDate ? new Date(props.prescription.startDate).toISOString().split('T')[0] : '',
  notes: props.prescription?.notes || ''
})

watch(() => props.prescription, (newPrescription) => {
  if (newPrescription) {
    isEdit.value = true
    formData.value = {
      animalId: newPrescription.animalId,
      productId: newPrescription.productId,
      dosage: newPrescription.dosage,
      unit: newPrescription.unit,
      frequency: newPrescription.frequency,
      duration: newPrescription.duration,
      startDate: newPrescription.startDate ? new Date(newPrescription.startDate).toISOString().split('T')[0] : '',
      notes: newPrescription.notes
    }
  }
}, { deep: true })

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  try {
    if (isEdit.value) {
      await healthStore.updatePrescription(props.prescription._id, formData.value)
    } else {
      await healthStore.createPrescription(formData.value)
    }
    emit('success')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Erreur lors de l\'opération'
  } finally {
    isLoading.value = false
  }
}
</script>
