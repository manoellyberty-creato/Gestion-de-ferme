<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const alerts = ref([])
const loading = ref(false)
const error = ref('')

async function fetchAlerts() {
	loading.value = true
	try {
		const res = await api.get('/alerts')
		alerts.value = res.data
	} catch (err) {
		error.value = err?.response?.data?.message || err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchAlerts)
</script>

<template>
	<div>
		<h2 class="text-xl mb-2">Alertes</h2>
		<div v-if="error" class="text-red-600">{{ error }}</div>
		<div v-if="loading">Chargement...</div>
		<ul v-else>
			<li v-for="a in alerts" :key="a._id" class="border p-2 mb-2">
				<div><strong>Titre:</strong> {{ a.title || a.message || a._id }}</div>
				<div><strong>Date:</strong> {{ a.createdAt || '-' }}</div>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>