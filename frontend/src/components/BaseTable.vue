<template>
  <table class="min-w-full border-collapse">
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key" class="text-left p-2 bg-slate-100">{{ col.label }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row._id" class="border-t">
        <td v-for="col in columns" :key="col.key" class="p-2">{{ row[col.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  columns: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})
</script>

<style scoped>
</style>
