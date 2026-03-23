// Routes pour la gestion des campagnes
import express from 'express';
import campaignController from '../controllers/campaign.controller.js';

const router = express.Router();

// Route pour récupérer toutes les campagnes
router.get('/', campaignController.getAllCampaigns);

// Route pour récupérer une campagne par ID
router.get('/:id', campaignController.getCampaignById);

// Route pour créer une nouvelle campagne
router.post('/', campaignController.createCampaign);

// Route pour mettre à jour une campagne
router.put('/:id', campaignController.updateCampaign);

// Route pour clôturer une campagne
router.post('/:id/close', campaignController.closeCampaign);

// Route pour supprimer une campagne
router.delete('/:id', campaignController.deleteCampaign);

// Route pour récupérer les statistiques d'une campagne
router.get('/:id/stats', campaignController.getCampaignStats);

// Route pour récupérer les campagnes actives
router.get('/status/active', campaignController.getActiveCampaigns);

export default router;