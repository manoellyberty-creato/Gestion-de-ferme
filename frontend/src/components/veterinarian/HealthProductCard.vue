<template>
  <div class="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4" :class="stockBorderColor">
    <div class="p-4">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div>
          <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
          <p class="text-xs text-gray-600">{{ product.type }} • {{ product.activeSubstance || 'N/A' }}</p>
        </div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusBadgeClass">
          {{ statusLabel }}
        </span>
      </div>

      <!-- Details Grid -->
      <div class="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p class="text-xs text-gray-600">Lot</p>
          <p class="text-sm font-semibold text-gray-900">{{ product.batchNumber || '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Dose</p>
          <p class="text-sm font-semibold text-gray-900">{{ product.dosage || '—' }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Acquisition</p>
          <p class="text-sm font-semibold text-gray-900">{{ formatDate(product.purchaseDate) }}</p>
        </div>
        <div>
          <p class="text-xs text-gray-600">Expiration</p>
          <p class="text-sm font-semibold" :class="expirationColor">{{ formatDate(product.expirationDate) }}</p>
        </div>
      </div>

      <!-- Stock -->
      <div class="mb-4 pb-4 border-b border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <p class="text-xs font-semibold text-gray-700">Stock</p>
          <p class="text-xs text-gray-600">{{ product.currentStock }}/{{ product.totalQuantity }} {{ product.unit }}</p>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="stockBarColor"
            :style="{ width: stockPercentage + '%' }"
          ></div>
        </div>
      </div>

      <!-- Alerts -->
      <div v-if="alerts.length > 0" class="mb-4 space-y-1">
        <div
          v-for="alert in alerts"
          :key="alert"
          class="text-xs p-2 rounded flex items-center gap-2"
          :class="alertClass(alert)"
        >
          <span>{{ alertIcon(alert) }}</span>
          <span>{{ alertMessage(alert) }}</span>
        </div>
      </div>

      <!-- Supplier Info -->
      <div class="mb-4 p-2 bg-gray-50 rounded">
        <p class="text-xs text-gray-600 mb-1">Fournisseur</p>
        <p class="text-sm font-semibold text-gray-900">{{ product.supplier || '—' }}</p>
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="$emit('use-product')"
          class="flex-1 px-3 py-2 text-xs bg-purple-100 hover:bg-purple-200 text-purple-900 rounded font-medium transition"
          :disabled="product.currentStock === 0"
        >
          📦 Utiliser
        </button>
        <button
          @click="$emit('restock')"
          class="flex-1 px-3 py-2 text-xs bg-blue-100 hover:bg-blue-200 text-blue-900 rounded font-medium transition"
        >
          ➕ Réapprov.
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

<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['use-product', 'restock', 'view-details'])

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const stockPercentage = computed(() => {
  if (!props.product.totalQuantity) return 0
  return Math.round((props.product.currentStock / props.product.totalQuantity) * 100)
})

const daysUntilExpiration = computed(() => {
  if (!props.product.expirationDate) return null
  const expDate = new Date(props.product.expirationDate)
  const now = new Date()
  const days = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24))
  return days
})

const isExpired = computed(() => {
  return daysUntilExpiration.value !== null && daysUntilExpiration.value < 0
})

const isNearExpiration = computed(() => {
  return daysUntilExpiration.value !== null && daysUntilExpiration.value >= 0 && daysUntilExpiration.value <= 30
})

const statusLabel = computed(() => {
  if (isExpired.value) return '❌ Expiré'
  if (isNearExpiration.value) return '⚠️ Expire bientôt'
  if (props.product.currentStock === 0) return '📉 Rupture'
  if (stockPercentage.value < 25) return '🔴 Faible'
  return '✅ OK'
})

const statusBadgeClass = computed(() => {
  if (isExpired.value) return 'bg-red-100 text-red-900'
  if (isNearExpiration.value) return 'bg-orange-100 text-orange-900'
  if (props.product.currentStock === 0) return 'bg-red-100 text-red-900'
  if (stockPercentage.value < 25) return 'bg-yellow-100 text-yellow-900'
  return 'bg-green-100 text-green-900'
})

const stockBorderColor = computed(() => {
  if (isExpired.value) return 'border-red-500'
  if (isNearExpiration.value) return 'border-orange-500'
  if (props.product.currentStock === 0) return 'border-red-500'
  if (stockPercentage.value < 25) return 'border-yellow-500'
  return 'border-green-500'
})

const stockBarColor = computed(() => {
  if (isExpired.value) return 'bg-red-500'
  if (isNearExpiration.value) return 'bg-orange-500'
  if (stockPercentage.value < 25) return 'bg-yellow-500'
  return 'bg-green-500'
})

const expirationColor = computed(() => {
  if (isExpired.value) return 'text-red-600 font-bold'
  if (isNearExpiration.value) return 'text-orange-600 font-semibold'
  return 'text-gray-900'
})

const alerts = computed(() => {
  const result = []
  if (isExpired.value) result.push('expired')
  if (isNearExpiration.value && !isExpired.value) result.push('nearExpiration')
  if (props.product.currentStock === 0) result.push('outOfStock')
  if (stockPercentage.value < 25 && props.product.currentStock > 0) result.push('lowStock')
  return result
})

const alertClass = (alert) => {
  const classes = {
    expired: 'bg-red-50 text-red-800',
    nearExpiration: 'bg-orange-50 text-orange-800',
    outOfStock: 'bg-red-50 text-red-800',
    lowStock: 'bg-yellow-50 text-yellow-800'
  }
  return classes[alert] || 'bg-gray-50 text-gray-800'
}

const alertIcon = (alert) => {
  const icons = {
    expired: '❌',
    nearExpiration: '⏰',
    outOfStock: '📉',
    lowStock: '📊'
  }
  return icons[alert] || '⚠️'
}

const alertMessage = (alert) => {
  const messages = {
    expired: 'Produit expiré',
    nearExpiration: `Expire dans ${daysUntilExpiration.value} jour(s)`,
    outOfStock: 'En rupture de stock',
    lowStock: 'Stock faible'
  }
  return messages[alert] || 'Attention'
}
</script>
