<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');

const logout = () => {
  localStorage.clear();
  router.push('/');
};
</script>

<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
    <h2 class="text-gray-500 font-medium">Bienvenue, <span class="text-gray-900 font-bold">{{ user.name }}</span></h2>
    
    <div class="flex items-center gap-6">
      <div class="flex flex-col text-right">
        <span class="text-sm font-bold text-gray-800 leading-none">{{ user.role?.toUpperCase() }}</span>
        <span class="text-xs text-green-600">Connecté</span>
      </div>
      
      <button 
        @click="logout"
        class="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
      >
        Déconnexion
      </button>
    </div>
  </header>
</template>