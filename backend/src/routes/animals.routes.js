// Routes pour la gestion des animaux
import express from 'express';
import animalController from '../controllers/animal.controller.js';

const router = express.Router();

// Route pour récupérer tous les animaux
router.get('/', animalController.getAllAnimals);

// Générer un QR code pour un animal spécifique
router.get('/:id/qrcode', animalController.generateAnimalQRCode);

// Scanner un QR code d'animal (récupérer les infos via tagNumber)
router.get('/scan/:tagNumber', animalController.scanAnimalQRCode);

// Mettre à jour le poids d'un animal via QR code
router.put('/scan/:tagNumber/weight', animalController.updateAnimalWeight);

// Changer le statut d'un animal via QR code
router.put('/scan/:tagNumber/status', animalController.updateAnimalStatus);

// Récupérer l'historique d'un animal via QR code
router.get('/scan/:tagNumber/history', animalController.getAnimalHistory);

// Statistiques des animaux pour une campagne
router.get('/campaign/:campaignId/stats', animalController.getCampaignAnimalStats);

export default router;