<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <!-- En-tête -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Prescription #{{ prescription._id?.slice(-6) || 'N/A' }}</h3>
        <p class="text-sm text-gray-500">{{ prescription.product?.name || prescription.productId }}</p>
      </div>
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium',
          prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        ]"
      >
        {{ prescription.status === 'active' ? 'Actif' : 'Terminé' }}
      </span>
    </div>

    <!-- Contenu -->
    <div class="space-y-3 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Animal:</span>
        <span class="font-medium">{{ prescription.animal?.name || 'N/A' }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Dosage:</span>
        <span class="font-medium">{{ prescription.dosage }} {{ prescription.unit }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Fréquence:</span>
        <span class="font-medium">{{ formatFrequency(prescription.frequency) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Durée:</span>
        <span class="font-medium">{{ prescription.duration }} jours</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">StartDate:</span>
        <span class="font-medium">{{ formatDate(prescription.startDate) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-4 border-t">
      <button
        @click="$emit('edit')"
        class="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
      >
        Éditer
      </button>
      <button
        @click="$emit('delete')"
        class="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  prescription: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatFrequency = (freq) => {
  const frequencies = {
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    biweekly: 'Bi-hebdomadaire',
    monthly: 'Mensuel'
  }
  return frequencies[freq] || freq
}
</script>
