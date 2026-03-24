<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const stats = ref(null)
const loading = ref(false)
const error = ref('')

async function fetchStats() {
	loading.value = true
	try {
		const res = await api.get('/reports/dashboard')
		stats.value = res.data
	} catch (err) {
		error.value = err?.response?.data?.message || err.message
	} finally {
		loading.value = false
	}
}

onMounted(fetchStats)
</script>

<template>
	<div>
		<h2 class="text-2xl mb-4">Tableau de bord</h2>
		<div v-if="error" class="text-red-600">{{ error }}</div>
		<div v-if="loading">Chargement...</div>
		<div v-else>
			<pre>{{ stats }}</pre>
		</div>
	</div>
</template>

<style scoped></style>