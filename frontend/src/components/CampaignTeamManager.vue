<script setup>
import { useCampaignStore } from "@/stores/campaign.store";
import { computed } from "vue";

const store = useCampaignStore();
const emit = defineEmits(["open-assign", "remove-member"]);

const roles = [
  { id: "manager", label: "Manager" },
  { id: "agent", label: "Agent" },
  { id: "veterinaire", label: "Vétérinaire" },
  { id: "comptable", label: "Comptable" },
];

// ✅ Utiliser computed pour garantir la réactivité sur chaque accès
const assignedAgents = computed(() => store.currentCampaign?.assignedAgents || []);

const getMemberName = (roleId) => {
  const member = assignedAgents.value.find((a) => a.role === roleId);
  return member?.userId?.name || "Non assigné";
};

const getMember = (roleId) => {
  return assignedAgents.value.find((a) => a.role === roleId);
};

const handleRemove = (member) => {
  if (!member || !member.userId) return;
  if (confirm(`Retirer ${member.userId.name} de ce projet ?`)) {
    emit("remove-member", member);
  }
};
</script>

<template>
  <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
      <h3 class="font-semibold text-slate-800 text-xs uppercase tracking-wider">
        Équipe assignée
      </h3>
    </div>

    <div class="divide-y divide-slate-100">
      <div
        v-for="role in roles"
        :key="role.id"
        class="p-4 flex items-center justify-between"
      >
        <div>
          <p class="text-[10px] text-slate-400 font-bold uppercase">
            {{ role.label }}
          </p>
          <p class="text-sm font-medium text-slate-700">
            {{ getMemberName(role.id) }}
          </p>
        </div>

        <div class="flex gap-2">
          <!-- Bouton de suppression si quelqu'un est assigné -->
          <button
            v-if="getMember(role.id)"
            @click="handleRemove(getMember(role.id))"
            class="text-xs font-semibold px-2 py-1 bg-rose-50 border border-rose-200 text-rose-600 rounded hover:bg-rose-100 transition-colors"
            title="Désassigner ce membre"
          >
            ✕
          </button>

          <!-- Bouton de modification/assignation -->
          <button
            @click="$emit('open-assign', role.id)"
            class="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 shadow-sm"
          >
            {{ getMember(role.id) ? "Remplacer" : "Assigner" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>