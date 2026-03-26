<template>
  <div class="bg-white rounded-lg shadow p-5 border-t-4" :class="topBorderClass">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="mt-2 text-2xl font-bold text-gray-900">{{ displayValue }}</p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div v-if="icon" class="text-3xl">{{ icon }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  value: [Number, String],
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'blue' // blue/green/red/orange/purple
  },
  subtitle: String,
  icon: String
})

const variantMap = {
  blue: 'border-blue-500',
  green: 'border-green-500',
  red: 'border-red-500',
  orange: 'border-orange-500',
  purple: 'border-purple-500',
  yellow: 'border-yellow-500'
}

const topBorderClass = variantMap[props.variant] || variantMap.blue

const displayValue = `${props.prefix}${props.value}${props.suffix}`
</script>
