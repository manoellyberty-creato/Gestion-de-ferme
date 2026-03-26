<script setup>
import { computed } from 'vue'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['approve', 'reject', 'view-details'])

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const typeLabel = computed(() => {
  const type = props.transaction.type
  const labels = {
    income: '📥 Revenu',
    expense: '📤 Dépense',
    transfer: '↔️ Transfert',
    refund: '🔄 Remboursement'
  }
  return labels[type] || type
})

const typeBadgeClass = computed(() => {
  const type = props.transaction.type
  const classes = {
    income: 'bg-green-100 text-green-900',
    expense: 'bg-orange-100 text-orange-900',
    transfer: 'bg-blue-100 text-blue-900',
    refund: 'bg-purple-100 text-purple-900'
  }
  return classes[type] || 'bg-gray-100 text-gray-900'
})

const amountColor = computed(() => {
  const type = props.transaction.type
  const colors = {
    income: 'text-green-600',
    expense: 'text-red-600',
    transfer: 'text-blue-600',
    refund: 'text-purple-600'
  }
  return colors[type] || 'text-gray-900'
})

const priorityBorder = computed(() => {
  const priority = props.transaction.priority || 'normal'
  const borders = {
    critical: 'border-red-500',
    high: 'border-orange-500',
    normal: 'border-blue-500',
    low: 'border-gray-300'
  }
  return borders[priority] || 'border-gray-300'
})
</script>

<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4" :class="priorityBorder">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold text-gray-900">{{ transaction.description }}</h3>
          <p class="text-xs text-gray-600">Ref: {{ transaction._id?.slice(-8) }}</p>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="typeBadgeClass">
          {{ typeLabel }}
        </span>
      </div>

      <!-- Amount & Date -->
      <div class="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p class="text-xs text-gray-600">Montant</p>
          <p class="text-lg font-bold" :class="amountColor">{{ formatCurrency(transaction.amount) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Date</p>
          <p class="text-sm font-semibold text-gray-900">{{ formatDate(transaction.date) }}</p>
        </div>
      </div>

      <!-- Category & Campaign -->
      <div class="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100 text-xs">
        <div>
          <p class="text-gray-600">Catégorie</p>
          <p class="font-semibold text-gray-900">{{ transaction.category || '—' }}</p>
        </div>
        <div>
          <p class="text-gray-600">Campagne</p>
          <p class="font-semibold text-gray-900">{{ transaction.campaign?.name || '—' }}</p>
        </div>
      </div>

      <!-- Submitted By -->
      <div class="mb-4 p-2 bg-gray-50 rounded text-xs">
        <p class="text-gray-600">Soumis par</p>
        <p class="font-semibold text-gray-900">{{ transaction.submittedBy?.fullName || 'N/A' }}</p>
        <p class="text-gray-600 mt-1">{{ formatDate(transaction.createdAt) }}</p>
      </div>

      <!-- Notes -->
      <div v-if="transaction.notes" class="mb-4 p-2 bg-blue-50 rounded">
        <p class="text-xs text-blue-900">
          <strong>Note:</strong> {{ transaction.notes }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('approve')"
          class="flex-1 px-3 py-2 text-xs bg-green-100 hover:bg-green-200 text-green-900 rounded font-medium transition"
        >
          ✅ Approuver
        </button>
        <button
          @click="$emit('reject')"
          class="flex-1 px-3 py-2 text-xs bg-red-100 hover:bg-red-200 text-red-900 rounded font-medium transition"
        >
          ❌ Rejeter
        </button>
        <button
          @click="$emit('view-details')"
          class="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-900 rounded font-medium transition"
        >
          👁️
        </button>
      </div>
    </div>
  </div>
</template>
