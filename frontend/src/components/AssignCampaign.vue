<script setup>
import { ref } from "vue";
import { useCampaignStore } from "@/stores/campaign.store";

const props = defineProps({
  role: String,
  users: Array,
});

const emit = defineEmits(["close"]);
const store = useCampaignStore();
const selectedUserId = ref("");
const isSubmitting = ref(false);
const confirmAssign = async () => {
  if (!selectedUserId.value) return;
  isSubmitting.value = true;
  const result = await store.assignMember(props.role, selectedUserId.value);
  if (result.success) {
    emit("close");
  } else {
    alert(result.error);
  }
  isSubmitting.value = false;
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
      <h2 class="text-xl font-bold text-slate-800 mb-1">
        Assigner un {{ role }}
      </h2>
      <p class="text-sm text-slate-500 mb-6">
        Sélectionnez le collaborateur à affecter à cette campagne.
      </p>

      <div class="mb-6">
        <label class="block text-xs font-bold text-slate-400 uppercase mb-2"
          >Collaborateur</label
        >
        <select
          v-model="selectedUserId"
          class="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        >
          <option value="" disabled>Choisir un membre...</option>
          <option v-for="user in users" :key="user._id" :value="user._id">
            {{ user.name }}
          </option>
        </select>
      </div>

      <div class="flex gap-3">
        <button
          @click="emit('close')"
          class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="confirmAssign"
          :disabled="!selectedUserId || isSubmitting"
          class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ isSubmitting ? "Chargement..." : "Confirmer" }}
        </button>
      </div>
    </div>
  </div>
</template>