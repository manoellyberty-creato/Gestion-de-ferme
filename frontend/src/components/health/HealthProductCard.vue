<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <!-- En-tête -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
        <p class="text-sm text-gray-500">{{ product.type }}</p>
      </div>
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium',
          product.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]"
      >
        {{ product.status === 'available' ? 'Disponible' : 'Indisponible' }}
      </span>
    </div>

    <!-- Contenu -->
    <div class="space-y-3 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Catégorie:</span>
        <span class="font-medium">{{ product.category }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Fournisseur:</span>
        <span class="font-medium">{{ product.supplier }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Stock:</span>
        <span class="font-medium">{{ product.quantity }} {{ product.unit }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Prix unitaire:</span>
        <span class="font-medium">{{ formatCurrency(product.unitPrice) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Expiration:</span>
        <span :class="['font-medium', isExpiringSoon(product.expirationDate) ? 'text-red-600' : '']">
          {{ formatDate(product.expirationDate) }}
        </span>
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
  product: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const isExpiringSoon = (expirationDate) => {
  if (!expirationDate) return false
  const daysUntilExpiration = (new Date(expirationDate) - new Date()) / (1000 * 60 * 60 * 24)
  return daysUntilExpiration <= 7
}
</script>
