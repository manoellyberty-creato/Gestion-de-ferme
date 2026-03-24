<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/useAuth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const res = await auth.login({ email: email.value, password: password.value })
    if (res?.token) {
      router.push({ name: 'Home' })
    } else {
      error.value = res?.message || 'Échec de la connexion'
    }
  } catch (err) {
    error.value = err?.response?.data?.message || err.message || 'Erreur'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl mb-4">Connexion</h2>
    <div v-if="error" class="text-red-600 mb-2">{{ error }}</div>
    <form @submit.prevent="submit" class="space-y-3">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" class="w-full border p-2" />
      </div>
      <div>
        <label>Mot de passe</label>
        <input v-model="password" type="password" class="w-full border p-2" />
      </div>
      <div>
        <button :disabled="loading" class="px-4 py-2 bg-slate-700 text-white">Se connecter</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
