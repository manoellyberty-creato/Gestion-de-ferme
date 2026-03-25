// services/departmentService.js
// ATTENTION : Le nom du fichier doit être EXACTEMENT celui dans ton dossier models
import Departement from "../models/department.js"; 

export const departmentService = {
  fetchActiveDepartments: async () => {
    try {
      // Utilise le nom de la constante que tu as exportée dans le modèle
      return await Departement.find({ isActive: true }).sort({ name: 1 });
    } catch (error) {
      throw new Error("Erreur service : " + error.message);
    }
  },
};