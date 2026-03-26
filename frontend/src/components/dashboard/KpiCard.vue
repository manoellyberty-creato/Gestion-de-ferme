<template>
  <div class="bg-white rounded-lg shadow p-5 border-l-4" :class="borderClass">
    <p class="text-sm font-medium text-gray-500">{{ title }}</p>
    <p class="mt-2 text-2xl font-bold text-gray-900">{{ formattedValue }}</p>
    <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  currency: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'blue' // blue/green/red/purple
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const variantMap = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  red: 'border-red-500',
  purple: 'border-purple-500',
  yellow: 'border-yellow-500'
}

const borderClass = variantMap[props.variant] || variantMap.blue

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    if (props.currency) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: 0
      }).format(props.value)
    }
    return props.value.toLocaleString('fr-FR')
  }
  return props.value || '-'
})
</script>
