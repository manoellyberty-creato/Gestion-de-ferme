<script setup>
import { ref, onMounted, computed } from 'vue';
import { animalService } from '@/services/animals.service.js';

const allAnimals = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const selectedAnimal = ref(null); // L'animal qu'on regarde en détail

const fetchAnimals = async () => {
  try {
    loading.value = true;
    const data = await animalService.getAll();
    allAnimals.value = data;
  } catch (err) {
    console.error("Erreur de chargement:", err);
  } finally {
    loading.value = false;
  }
};

// Filtre dynamique pour la barre de recherche
const filteredAnimals = computed(() => {
  return allAnimals.value.filter(a => 
    a.nom.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.espece.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(fetchAnimals);
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto">
      
      <div class="mb-8 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Tous les Animaux ({{ allAnimals.length }})</h1>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Rechercher un animal..." 
          class="p-2 border rounded-lg w-64 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="a in filteredAnimals" :key="a._id" 
             class="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-bold text-lg text-blue-900">{{ a.nom }}</h3>
            <span class="text-[10px] bg-gray-100 px-2 py-1 rounded font-mono">{{ a.qrCode }}</span>
          </div>
          <p class="text-sm text-gray-500 mb-4">{{ a.espece }} • {{ a.race }}</p>
          
          <button @click="selectedAnimal = a" 
                  class="w-full py-2 bg-green-50 text-white-600 rounded-xl font-semibold hover:bg-green-700 hover:text-white transition-colors">
            Voir Détails
          </button>
        </div>
      </div>

      <div v-if="selectedAnimal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
          
          <div class="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold">Fiche de {{ selectedAnimal.nom }}</h2>
            <button @click="selectedAnimal = null" class="text-2xl text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-3 rounded-xl">
                <span class="text-xs text-gray-400 block uppercase">Statut</span>
                <span class="font-bold text-green-600">{{ selectedAnimal.statut }}</span>
              </div>
              <div class="bg-gray-50 p-3 rounded-xl">
                <span class="text-xs text-gray-400 block uppercase">Poids Actuel</span>
                <span class="font-bold">{{ selectedAnimal.currentWeight || 'N/A' }} kg</span>
              </div>
            </div>

            <div class="space-y-2">
              <p><strong>Espèce :</strong> {{ selectedAnimal.espece }}</p>
              <p><strong>Race :</strong> {{ selectedAnimal.race || 'Non précisée' }}</p>
              <p><strong>Date de naissance :</strong> {{ new Date(selectedAnimal.dateOfBirth).toLocaleDateString() }}</p>
              <p><strong>Secteur :</strong> {{ selectedAnimal.department?.name || 'Chargement...' }}</p>
            </div>

            <div v-if="selectedAnimal.growthHistory?.length" class="mt-4">
              <h4 class="text-sm font-bold text-gray-500 mb-2 uppercase">Dernières pesées</h4>
              <div class="max-h-32 overflow-y-auto border rounded-lg p-2 space-y-1">
                <div v-for="log in selectedAnimal.growthHistory" :key="log._id" class="text-xs flex justify-between border-b pb-1">
                  <span>{{ new Date(log.date).toLocaleDateString() }}</span>
                  <span class="font-bold">{{ log.weight }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 bg-gray-50 text-right">
            <button @click="selectedAnimal = null" 
                    class="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors">
              Fermer
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>