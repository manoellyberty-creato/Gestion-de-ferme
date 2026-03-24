<script setup>
import { ref, onMounted } from 'vue'
import { getFeeds, getLowStockAlerts, getFeedStatsSummary } from '../services/feed.service'

const feeds = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  try {
    const res = await getFeeds()
    feeds.value = res.data
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
    <h2 class="text-xl mb-2">Alimentation - Stocks</h2>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-if="loading">Chargement...</div>
    <ul v-else>
      <li v-for="f in feeds" :key="f._id" class="border p-2 mb-2">
        <div><strong>Produit:</strong> {{ f.name || f._id }}</div>
        <div><strong>Quantité:</strong> {{ f.quantity ?? f.stock ?? '-' }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
