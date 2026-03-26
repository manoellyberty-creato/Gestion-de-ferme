import express from 'express';
import * as animalCtrl from '../controllers/animal.controller.js';

const router = express.Router();

// Route pour récupérer tous les animaux
router.get('/', animalController.getAllAnimals);

// Route pour récupérer un animal par ID
router.get('/:id', animalController.getAnimalById);

// Route pour créer un nouvel animal
router.post('/', animalController.createAnimal);

// Route pour mettre à jour un animal
router.put('/:id', animalController.updateAnimal);

// Route pour supprimer un animal
router.delete('/:id', animalController.deleteAnimal);

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