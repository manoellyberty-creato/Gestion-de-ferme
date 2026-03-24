<script setup>
import { useAuthStore } from './stores/useAuth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
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

<style scoped>
</style>
