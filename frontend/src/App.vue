<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/useAuth'
import { useRoute } from 'vue-router'
import NavBar from './layouts/NavBar.vue';
import Aside from './layouts/AsideBar.vue';

const auth = useAuthStore()
const route= useRoute()


// On affiche les menus SEULEMENT si on n'est pas sur la page login
const showMenus = computed(() => route.path !== '/login' && route.path !== '/');
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <Aside v-if="showMenus" />

    <div class="flex-1 flex flex-col">
      <NavBar v-if="showMenus" />
      
      <main :class="showMenus ? 'p-8' : ''">
        <router-view />
      </main>
    </div>
  </div>
  <div class="min-h-screen">
    <header class="p-4 bg-slate-800 text-white flex justify-between">
      <div class="font-bold">Gestion de ferme</div>
      <nav>
        <button v-if="auth.token" @click="logout" class="px-3 py-1 bg-red-500 rounded">Déconnexion</button>
        <router-link v-else to="/login" class="px-3 py-1 bg-green-500 rounded">Connexion</router-link>
      </nav>
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>





<style>
/* Reset de base pour que le layout prenne tout l'écran */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
