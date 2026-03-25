<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './layouts/NavBar.vue';
import Aside from './layouts/AsideBar.vue';

const route = useRoute();

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
</template> 

<style>
/* Reset de base pour que le layout prenne tout l'écran */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
