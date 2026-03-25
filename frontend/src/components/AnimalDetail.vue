<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/services/api'

const props = defineProps({
  id: { type: [String, Number], required: true }
})
console.log(props.id)
const emit = defineEmits(['close'])
const loading = ref(false)
const error = ref(null)
const animal = ref(null)
const history = ref([])

async function loadAnimal() {
  if (!props.id) return
  loading.value = true
  error.value = null
  try {
    const response = await api.get(`/animals/${props.id}`)
    // On vérifie si la donnée est dans .data ou .data.data selon ton API
    animal.value = response.data.data || response.data
    history.value = animal.value?.growthHistory || []
  } catch (err) {
    error.value = "Impossible de charger les détails."
  } finally {
    loading.value = false
  }
}

watch(() => props.id, loadAnimal)
onMounted(loadAnimal)

async function downloadQR() {
  try {
    const response = await api.get(`/animals/${props.id}/qrcode`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.download = `qr_${props.id}.png`
    link.click()
  } catch (err) {
    alert('Erreur téléchargement');
  }
}
</script>

<template>
  <div class="detail-content">
    <button class="btn-close" @click="$emit('close')">× Fermer</button>

    <div v-if="loading">Chargement des détails...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="animal">
      <h2>{{ animal.name }}</h2>
      <div class="info-grid">
        <p><strong>Type:</strong> {{ animal.type }}</p>
        <p><strong>Âge:</strong> {{ animal.age }} mois</p>
        <p><strong>Poids actuel:</strong> {{ animal.currentWeight }} kg</p>
      </div>

      <h3>Historique de croissance</h3>
      <ul v-if="history.length">
        <li v-for="(h, i) in history" :key="i">
          {{ new Date(h.date).toLocaleDateString() }} : {{ h.weight }} kg
        </li>
      </ul>
      <p v-else>Aucun historique.</p>

      <button class="btn-qr" @click="downloadQR">Télécharger QR Code</button>
    </div>
  </div>
</template>

<style scoped>
.btn-close { position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.btn-qr { background: #2ecc71; color: white; padding: 10px; width: 100%; border-radius: 5px; margin-top: 20px; cursor: pointer; }
</style>