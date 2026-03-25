<script setup>
import { ref, onMounted, computed } from "vue";
import { userService } from "@/services/user.service";
import {
  notifyError,
  notifySuccess,
  notifyInfo,
  confirmDelete,
} from "@/utils/notifications";

const users = ref([]);
const loading = ref(false);
const showModal = ref(false);
const isEditing = ref(false);
const searchQuery = ref("");
const selectedDept = ref("");
// Formulaire réactif
const userForm = ref({
  _id: null,
  name: "",
  email: "",
  password: "",
  role: "agent",
  department: "",
});

// 1. Liste des départements uniques pour le filtre (dynamique)
const departments = computed(() => {
  const depts = users.value
    .map((u) => u.department)
    .filter((d) => d && d.trim() !== ""); // On enlève les vides
  return [...new Set(depts)]; // On retire les doublons
});

// 2. LA LOGIQUE DE FILTRAGE
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesDept =
      selectedDept.value === "" || user.department === selectedDept.value;

    return (matchesName || matchesEmail) && matchesDept;
  });
});

// Charger les utilisateurs au montage
const fetchUsers = async () => {
  loading.value = true;
  try {
    users.value = await userService.getAll();
  } catch (err) {
    notifyError("Impossible de charger les utilisateurs");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);

// Ouvrir la modale (Ajout ou Edit)
const openModal = (user = null) => {
  if (user) {
    isEditing.value = true;
    userForm.value = { ...user, password: "" }; // On ne charge pas le vieux password
  } else {
    isEditing.value = false;
    userForm.value = {
      name: "",
      email: "",
      password: "",
      role: "agent",
      department: "",
    };
  }
  showModal.value = true;
};

// Sauvegarder (Create ou Update)
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      const { _id, ...userData } = userForm.value;

      if (!userData.password || userData.password.trim() === "") {
        delete userData.password;
      }
      await userService.update(_id, userData);
      notifySuccess("Utilisateur mis à jour");
    } else {
      // 1. On crée une copie des données
      const userData = { ...userForm.value };

      // 2. On SUPPRIME l'id pour qu'il ne soit pas envoyé au serveur (même s'il est null)
      delete userData._id;

      // 3. On vérifie que le mot de passe n'est pas vide avant d'envoyer
      if (!userData.password || userData.password.trim() === "") {
        return notifyError(
          "Le mot de passe est obligatoire pour un nouvel utilisateur",
        );
      }

      await userService.create(userData);
      notifySuccess("Utilisateur créé");
    }
    showModal.value = false;
    fetchUsers();
  } catch (err) {
    notifyError("Action échouée");
  }
};

// Supprimer
const deleteUser = async (id) => {
  // 1. On attend la réponse de la promesse de confirmation
  const confirmed = await confirmDelete(
    "Voulez-vous vraiment supprimer cet utilisateur ?",
  );

  // 2. On vérifie la variable 'confirmed' (et non 'result')
  // Note: Si ton utilitaire utilise SweetAlert2, il renvoie souvent .isConfirmed
  if (confirmed.isConfirmed || confirmed === true) {
    try {
      await userService.delete(id);
      notifySuccess("Utilisateur supprimé avec succès");
      fetchUsers(); // Rafraîchir la liste
    } catch (err) {
      notifyError("Erreur lors de la suppression");
    }
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen gap-6">
    
    <div class="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <div class="absolute inset-0 bg-user bg-cover bg-center">
        <div class="absolute inset-0 bg-gradient-to-r from-green-900/90 to-black/20"></div>
      </div>

      <div class="relative h-full flex flex-col justify-center px-8 text-white">
        <div class="flex justify-between items-end">
          <div>
            <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
              Administration
            </span>
            <h1 class="text-3xl font-bold">Équipe FermeConnect</h1>
            <p class="text-green-100 mt-1 max-w-md">
              Supervisez les accès de vos collaborateurs et gérez les permissions par département.
            </p>
          </div>
          
          <div class="hidden md:flex gap-8 mb-2">
            <div class="text-center">
              <p class="text-3xl font-bold">{{ filteredUsers.length }}</p>
              <p class="text-xs text-green-200 uppercase">Utilisateurs</p>
            </div>
            <div class="w-px h-10 bg-white/20 my-auto"></div>
            <div class="text-center">
              <p class="text-3xl font-bold">{{ departments.length }}</p>
              <p class="text-xs text-green-200 uppercase">Secteurs</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      
      <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-1 w-full gap-4">
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un membre..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>

          <select
            v-model="selectedDept"
            class="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none min-w-[180px]"
          >
            <option value="">Tous les départements</option>
            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>

        <button
          @click="openModal()"
          class="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouveau membre
        </button>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
            <tr>
              <th class="px-6 py-4">Collaborateur</th>
              <th class="px-6 py-4">Rôle</th>
              <th class="px-6 py-4">Département</th>
              <th class="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-green-50/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="font-bold text-gray-900">{{ user.name }}</span>
                  <span class="text-xs text-gray-500">{{ user.email }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="{
                    'bg-purple-100 text-purple-700': user.role === 'admin',
                    'bg-blue-100 text-blue-700': ['veto', 'veterinaire'].includes(user.role),
                    'bg-green-100 text-green-700': user.role === 'agent',
                    'bg-orange-100 text-orange-700': user.role === 'manager',
                  }"
                  class="px-2 py-1 rounded text-[10px] font-black uppercase"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                {{ user.department || "Général" }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click="openModal(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
                  <button @click="deleteUser(user._id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ isEditing ? "Modifier l'utilisateur" : "Nouveau collaborateur" }}
          </h2>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input v-model="userForm.name" type="text" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="userForm.email" type="email" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe {{ isEditing ? '(laisser vide pour ne pas changer)' : '' }}
            </label>
            <input v-model="userForm.password" type="password" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" :required="!isEditing" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select v-model="userForm.role" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none">
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="manager">Manager</option>
                <option value="veterinaire">Vétérinaire</option>
                <option value="comptable">Comptable</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Département</label>
              <input v-model="userForm.department" type="text" placeholder="Ex: Soins" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="showModal = false" class="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition">
              Annuler
            </button>
            <button type="submit" class="flex-1 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-all shadow-lg shadow-green-900/20">
              {{ isEditing ? 'Mettre à jour' : 'Créer le compte' }}
            </button>
          </div>
        </form>
      </div>
    </div>
      </div>
    </div>
    
    </div>
</template>

<style scoped>
.bg-user {
  background-image: url('@/assets/images/equipeagro.jpg');
}
</style>