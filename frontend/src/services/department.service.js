// services/department.service.js
import api from './api';

// Remplace par l'URL de ton API (ex: http://localhost:3000/api)
const API_URL = 'http://localhost:7000/api/departments'; 

export const getAllDepartments = async () => {
    try {
        const response = await api.get(API_URL);
        return response.data; // On retourne directement les données
    } catch (error) {
        console.error("Erreur lors de la récupération des départements", error);
        throw error;
    }
};