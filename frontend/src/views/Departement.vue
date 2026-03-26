<script setup>
import { ref, onMounted } from "vue";
import { departmentService } from "@/services/department.service";

const departments = ref([]);
const loading = ref(true);

const fetchDepts = async () => {
  try {
    departments.value = await departmentService.getAll();
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDepts);

// Petit helper pour les icônes selon le nom
const getIcon = (name) => {
  const normalizedName = name.toUpperCase();

  if (normalizedName.includes('VOLAILLE')) {
    return `
      <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l2 4h-4l2-4zM7 8l-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6l-2-2H7zM9 12h.01M15 12h.01" />
      </svg>`;
  }
  
  if (normalizedName.includes('BETAIL')) {
    return `
      <svg class="w-8 h-8 text-brown-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2 0-4 1-4 3v5h8v-5c0-2-2-3-4-3zM4 11h2M18 11h2M9 21v-2M15 21v-2" />
      </svg>`;
  }
  
  if (normalizedName.includes('PISCICULTURE')) {
    return `
      <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12l-5 3v-6l5 3zM3 12h12M7 10l-2 2 2 2" />
      </svg>`;
  }

  // Icône par défaut (Tracteur/Ferme)
  return `
    <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>`;
};
</script>

<template>
  <div class="p-8">
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-gray-800">Départements de la Ferme</h1>
      <p class="text-gray-500">Aperçu global de la structure et des effectifs.</p>
    </header>

    <div v-if="loading" class="flex justify-center p-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        v-for="dept in departments" 
        :key="dept._id"
        class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group relative overflow-hidden"
      >
<div 
  class="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform"
  v-html="getIcon(dept.name)"
>
  </div>

        <div class="flex justify-between items-start mb-4">
       <div class="p-3 bg-green-50 rounded-xl flex items-center justify-center">
  <div v-html="getIcon(dept.name)"></div>
</div>
          <span class="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
             {{ dept.metadata?.type || 'Secteur' }}
          </span>
        </div>

        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ dept.name }}</h2>
        <p class="text-gray-600 text-sm mb-6 leading-relaxed">
          {{ dept.description }}
        </p>

        <div class="pt-6 border-t border-gray-50 flex justify-between items-center">
          <div>
            <span class="block text-2xl font-black text-green-700">{{ dept.animalCount }}</span>
            <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Animaux enregistrés</span>
          </div>
          
          <router-link 
            :to="{ name: 'Animals', query: { dept: dept._id }}"
            class="p-2 bg-gray-50 text-gray-400 hover:bg-green-700 hover:text-white rounded-lg transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>