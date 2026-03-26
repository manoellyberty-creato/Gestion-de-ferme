<script setup>
defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
    <!-- Header -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ transaction.description }}</h3>
        <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
      </div>
      <span
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium',
          transaction.type === 'income'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        ]"
      >
        {{ transaction.type === 'income' ? 'Revenu' : 'Dépense' }}
      </span>
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div class="flex justify-between">
        <span class="text-gray-600">Montant:</span>
        <span :class="['font-semibold', transaction.type === 'income' ? 'text-green-600' : 'text-red-600']">
          {{ formatCurrency(transaction.amount) }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-600">Catégorie:</span>
        <span class="font-medium">{{ transaction.category }}</span>
      </div>
      <div v-if="transaction.campaign" class="flex justify-between">
        <span class="text-gray-600">Campagne:</span>
        <span class="font-medium">{{ transaction.campaign?.name }}</span>
      </div>
      <div v-if="transaction.recordedBy" class="flex justify-between">
        <span class="text-gray-600">Enregistrée par:</span>
        <span class="text-sm">{{ transaction.recordedBy?.name }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-4 border-t">
      <button
        @click="$emit('edit')"
        class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium text-sm"
      >
        Éditer
      </button>
      <button
        @click="$emit('delete')"
        class="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium text-sm"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>
