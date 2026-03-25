<script setup>
import { ref, onMounted } from 'vue'
import { getAllAnimals } from '../services/animals.service.js'
import AnimalDetail from './AnimalDetail.vue'

const selectedAnimalId = ref(null)
const animals = ref([])
const loading = ref(false)
const error = ref(null)

async function fetchAnimals() {
  loading.value = true
  error.value = null
  try {
    const response = await getAllAnimals()
    // Correction de l'assignation pour être plus robuste
    const data = response.data?.data || response.data || []
    animals.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = "Erreur lors de la récupération des animaux."
    console.error(err)
  } finally {
    loading.value = false
  }
}

function viewDetails(id) {
  selectedAnimalId.value = id
}

function closeDetails() {
  selectedAnimalId.value = null
}

onMounted(() => {
  fetchAnimals()
})
</script>

<template>
  <div class="animal-container">
    <h1>Gestion des Animaux</h1>

    <div v-if="selectedAnimalId" class="details-overlay" @click.self="closeDetails">
      <div class="details-modal">
        <AnimalDetail :id="selectedAnimalId" @close="closeDetails" />
      </div>
    </div>

    <div v-if="loading" class="info-msg">Chargement...</div>
    <div v-else-if="error" class="error-msg">{{ error }}</div>

    <div v-else class="animal-grid">
      <div v-for="animal in animals" :key="animal._id" class="animal-card">
        <div class="card-header">
          <h3>Tag: {{ animal.qrCode || 'N/A' }}</h3>
          <span :class="['status-badge', animal.status]">
            {{ animal.status }}
          </span>
        </div>

        <div class="card-body">
          <p><strong>Nom:</strong> {{ animal.name }}</p>
          <p><strong>Poids:</strong> {{ animal.currentWeight || animal.initialWeight }} kg</p>
        </div>

        <div class="card-actions">
          <button @click="viewDetails(animal._id)" class="btn-view">Voir plus</button>
        </div>
      </div>
      <p v-if="animals.length === 0">Aucun animal trouvé.</p>
    </div>
  </div>
</template>

<style scoped>
.animal-container { padding: 20px; }
.animal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.animal-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* --- STYLES DE LA MODALE --- */
.details-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.details-modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.btn-view { background: #3498db; color: white; cursor: pointer; padding: 8px; border-radius: 4px; }
</style>