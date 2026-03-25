<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle-status'])

const statusLabel = computed(() => {
  const status = props.task.status
  if (status === 'completed') return 'Terminée'
  if (status === 'in_progress') return 'En cours'
  return 'En attente'
})

const buttonClass = computed(() => {
  return props.task.status === 'completed'
    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    : 'bg-green-100 text-green-800 hover:bg-green-200'
})

const statusClass = computed(() => {
  const status = props.task.status
  if (status === 'completed') return 'text-green-700'
  if (status === 'in_progress') return 'text-blue-700'
  return 'text-orange-700'
})

const statusBorderColor = computed(() => {
  const status = props.task.status
  if (status === 'completed') return 'border-green-500'
  if (status === 'in_progress') return 'border-blue-500'
  return 'border-orange-500'
})

const progressColor = computed(() => {
  const progress = props.task.progress || 0
  if (progress >= 80) return 'bg-green-500'
  if (progress >= 50) return 'bg-yellow-500'
  return 'bg-blue-500'
})

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 border-l-4" :class="statusBorderColor">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-gray-900">{{ task.title }}</h3>
        <p class="text-xs text-gray-500">{{ task.description || 'Pas de description' }}</p>
      </div>
      <button
        @click="$emit('toggle-status', task._id)"
        class="px-3 py-1 rounded text-xs font-semibold transition"
        :class="buttonClass"
      >
        {{ task.status === 'completed' ? 'Réouvrir' : 'Terminer' }}
      </button>
    </div>

    <div class="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
      <div>
        <span class="block">Échéance</span>
        <strong>{{ formatDate(task.dueDate) }}</strong>
      </div>
      <div>
        <span class="block">Progression</span>
        <strong>{{ task.progress || 0 }}%</strong>
      </div>
      <div>
        <span class="block">Statut</span>
        <strong :class="statusClass">{{ statusLabel }}</strong>
      </div>
    </div>

    <div class="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div class="h-full rounded-full" :style="{ width: (task.progress || 0) + '%' }" :class="progressColor"></div>
    </div>
  </div>
</template>
