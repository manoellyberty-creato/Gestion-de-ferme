<script setup>
// On laisse le router gérer l'affichage des composants via <router-view/>
</script>

<template>
  <div id="app">
    <nav v-if="$route.name !== 'Login'">
      <router-link to="/">Dashboard</router-link> |
      <router-link to="/animals">Animaux</router-link>
    </nav>
    
    <router-view/>
  </div>
</template>

<style>
/* Styles globaux */
body { margin: 0; font-family: sans-serif; }
</style>