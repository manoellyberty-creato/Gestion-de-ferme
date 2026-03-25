// Routes pour la gestion de la santé des animaux
import express from 'express';
import healthController from '../controllers/health.controller.js';
import requireAuth from '../middlewares/requireAuth.js';
import requireRole from '../middlewares/requireRole.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// === ROUTES POUR LES PRODUITS DE SANTÉ ===
// Seuls les vétérinaires et administrateurs peuvent gérer les produits
router.post('/products',
    requireRole(['veterinaire', 'admin']),
    healthController.createHealthProduct
);

router.get('/products',
    requireRole(['veterinaire', 'admin', 'responsable', 'agent']),
    healthController.getAllHealthProducts
);

router.get('/products/:id',
    requireRole(['veterinaire', 'admin', 'responsable', 'agent']),
    healthController.getHealthProductById
);

router.put('/products/:id',
    requireRole(['veterinaire', 'admin']),
    healthController.updateHealthProduct
);

router.patch('/products/:id/deactivate',
    requireRole(['veterinaire', 'admin']),
    healthController.deactivateHealthProduct
);

// === ROUTES POUR LES PRESCRIPTIONS ===
// Créer une prescription (vétérinaires uniquement)
router.post('/prescriptions',
    requireRole(['veterinaire', 'admin']),
    healthController.createPrescription
);

// Récupérer toutes les prescriptions
router.get('/prescriptions',
    requireRole(['veterinaire', 'admin', 'responsable', 'agent', 'comptable']),
    healthController.getAllPrescriptions
);

// Récupérer une prescription par ID
router.get('/prescriptions/:id',
    requireRole(['veterinaire', 'admin', 'responsable', 'agent', 'comptable']),
    healthController.getPrescriptionById
);

// Mettre à jour une prescription entière
router.put('/prescriptions/:id',
    requireRole(['veterinaire', 'admin']),
    healthController.updatePrescription
);

// Supprimer une prescription
router.delete('/prescriptions/:id',
    requireRole(['veterinaire', 'admin']),
    healthController.deletePrescription
);

// Récupérer les prescriptions d'un animal
router.get('/animals/:animalId/prescriptions',
    requireRole(['veterinaire', 'admin', 'responsable', 'agent']),
    healthController.getPrescriptionsByAnimal
);

// Récupérer les prescriptions d'une campagne
router.get('/campaigns/:campaignId/prescriptions',
    requireRole(['veterinaire', 'admin', 'responsable', 'comptable']),
    healthController.getPrescriptionsByCampaign
);

// Mettre à jour le statut d'une prescription
router.patch('/prescriptions/:id/status',
    requireRole(['veterinaire', 'admin']),
    healthController.updatePrescriptionStatus
);

// Ajouter une administration de médicament
router.post('/prescriptions/:id/administrations',
    requireRole(['veterinaire', 'admin', 'agent']),
    healthController.addAdministration
);

// === ROUTES POUR LES STATISTIQUES ET ALERTES ===
// Statistiques de santé
router.get('/statistics',
    requireRole(['veterinaire', 'admin', 'responsable', 'comptable']),
    healthController.getHealthStatistics
);

// Produits expirés
router.get('/products/expired',
    requireRole(['veterinaire', 'admin', 'responsable']),
    healthController.getExpiredProducts
);

// Produits proches de l'expiration
router.get('/products/near-expiration',
    requireRole(['veterinaire', 'admin', 'responsable']),
    healthController.getProductsNearExpiration
);

// Alertes de santé
router.get('/alerts',
    requireRole(['veterinaire', 'admin', 'responsable']),
    healthController.getHealthAlerts
);

export default router;