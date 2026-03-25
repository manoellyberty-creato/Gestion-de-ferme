<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router"; // <--- Import indispensable
import { animalService } from "@/services/animals.service.js";

const route = useRoute();
const allAnimals = ref([]); // On garde une copie de tous les animaux
const filteredAnimals = ref([]); // Ce qu'on affiche réellement
const loading = ref(true);

const fetchAnimals = async () => {
  loading.value = true;
  try {
    const data = await animalService.getAll();
    allAnimals.value = data;
    applyFilter(); // On filtre dès que les données arrivent
  } finally {
    loading.value = false;
  }
};

const applyFilter = () => {
  const deptIdFromQuery = route.query.dept;
  
  if (deptIdFromQuery) {
    filteredAnimals.value = allAnimals.value.filter(a => {
      // On récupère l'ID peu importe si c'est peuplé ou non
      const animalDeptId = a.department?._id || a.department;
      
      // On compare en forçant en String pour éviter les erreurs de type
      return String(animalDeptId) === String(deptIdFromQuery);
    });
  } else {
    // Si pas de filtre dans l'URL, on affiche tout le monde
    filteredAnimals.value = allAnimals.value;
  }
};

// Si l'utilisateur clique sur un autre département alors qu'il est déjà sur la page
watch(() => route.query.dept, () => {
  applyFilter();
});

onMounted(fetchAnimals);
</script>


<template>
    <pre class="bg-gray-100 p-2 text-[10px]">{{ allAnimals.length }} animaux chargés</pre>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">
        {{ route.query.dept ? 'Résultats du secteur' : 'Tous les Animaux' }}
      </h1>
      <router-link v-if="route.query.dept" to="/animals" class="text-sm text-blue-600 underline">
        Voir tous les animaux
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="a in filteredAnimals" :key="a._id" class="p-4 border rounded-xl shadow-sm bg-white">
        <div class="flex justify-between">
           <h3 class="font-bold text-lg">{{ a.nom }}</h3>
           <img :src="a.qrCode" class="w-10 h-10 opacity-50" />
        </div>
        <p class="text-gray-500 text-sm">{{ a.espece }} - {{ a.race }}</p>
        <div class="mt-2 text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded inline-block">
          {{ a.department?.name || 'Secteur inconnu' }}
        </div>
      </div>
    </div>
    
    <div v-if="filteredAnimals.length === 0 && !loading" class="text-center py-20 text-gray-400">
      Aucun animal trouvé dans ce département.
    </div>
  </div>
</template>