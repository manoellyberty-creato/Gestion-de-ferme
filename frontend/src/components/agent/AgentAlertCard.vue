<script setup>
import { computed } from 'vue'

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['mark-read'])

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const severityLabel = computed(() => {
  if (props.alert.severity === 'critical') return 'Critique'
  if (props.alert.severity === 'serious') return 'Sérieuse'
  if (props.alert.severity === 'moderate') return 'Modérée'
  return 'Mineure'
})

const severityClass = computed(() => {
  if (props.alert.severity === 'critical') return 'text-red-700'
  if (props.alert.severity === 'serious') return 'text-orange-700'
  if (props.alert.severity === 'moderate') return 'text-yellow-700'
  return 'text-green-700'
})

const severityBorderClass = computed(() => {
  if (props.alert.severity === 'critical') return 'border-red-500'
  if (props.alert.severity === 'serious') return 'border-orange-500'
  if (props.alert.severity === 'moderate') return 'border-yellow-500'
  return 'border-green-500'
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border-l-4" :class="severityBorderClass">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-gray-900">{{ alert.title }}</h3>
        <p class="text-xs text-gray-500">{{ formatDate(alert.createdAt) }}</p>
      </div>
      <button
        @click="$emit('mark-read', alert._id)"
        class="px-3 py-1 rounded text-xs font-medium text-white bg-blue-500 hover:bg-blue-600"
      >
        Marquer lu
      </button>
    </div>
    <p class="mt-3 text-sm text-gray-700">{{ alert.message }}</p>
    <p class="mt-2 text-xs font-semibold" :class="severityClass">{{ severityLabel }}</p>
  </div>
</template>
