<script setup>
import { ref, onMounted } from 'vue'
import { getUsers } from '../services/user.service'

const users = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  try {
    const res = await getUsers()
    users.value = res.data
  } catch (err) {
    error.value = err?.response?.data?.message || err.message
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <h2 class="text-xl mb-2">Utilisateurs</h2>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-if="loading">Chargement...</div>
    <ul v-else>
      <li v-for="u in users" :key="u._id" class="border p-2 mb-2">
        <div><strong>Nom:</strong> {{ u.name || u.email }}</div>
        <div><strong>Rôle:</strong> {{ u.role || '-' }}</div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
