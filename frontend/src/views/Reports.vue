<script setup>
import { ref, onMounted } from 'vue'
import { getDashboard, getKpis } from '../services/report.service'

const dashboard = ref(null)
const kpis = ref(null)
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  try {
    const d = await getDashboard()
    const k = await getKpis()
    dashboard.value = d.data
    kpis.value = k.data
  } catch (err) {
    error.value = err?.response?.data?.message || err.message
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h2 class="text-xl mb-2">Rapports & KPI</h2>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-if="loading">Chargement...</div>
    <div v-else>
      <pre class="bg-slate-50 p-3">{{ dashboard }}</pre>
      <pre class="bg-slate-50 p-3">{{ kpis }}</pre>
    </div>
  </div>
</template>

<style scoped></style>
