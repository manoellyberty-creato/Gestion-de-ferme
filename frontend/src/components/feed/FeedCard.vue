<script setup>
import { defineProps, defineEmits } from 'vue'
import { useFeed } from '../../stores/useFeed'

const props = defineProps({
  feed: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])
const feedStore = useFeed()

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

const handleDeactivate = async () => {
  if (confirm('Êtes-vous sûr de vouloir désactiver ce produit ?')) {
    try {
      await feedStore.deactivateFeed(props.feed._id)
    } catch (err) {
      console.error('Erreur:', err.message)
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <!-- En-tête -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ feed.name }}</h3>
        <p class="text-sm text-gray-500">{{ feed.category }}</p>
      </div>
      <span
        :class="[
          'px-3 py-1 rounded-full text-xs font-medium',
          feed.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        ]"
      >
        {{ feed.isActive ? 'Actif' : 'Inactif' }}
      </span>
    </div>

    <!-- Contenu -->
    <div class="space-y-3 mb-4">
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Fournisseur:</span>
        <span class="font-medium">{{ feed.supplier }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Quantité:</span>
        <span class="font-medium">{{ feed.quantity }} {{ feed.unit }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Prix unitaire:</span>
        <span class="font-medium">{{ formatCurrency(feed.unitPrice) }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span class="text-gray-600">Date expiration:</span>
        <span :class="['font-medium', isExpiringSoon(feed.expirationDate) ? 'text-red-600' : '']">
          {{ formatDate(feed.expirationDate) }}
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
        v-if="feed.isActive"
        @click="handleDeactivate"
        class="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
      >
        Désactiver
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
