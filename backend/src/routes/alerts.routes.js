// Routes pour le système d'alertes
import express from 'express';
import alertController from '../controllers/alert.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// Route pour récupérer toutes les alertes
router.get('/',
    requireRole(['admin', 'gerant', 'veterinaire', 'comptable']),
    alertController.getAllAlerts
);

// Route pour récupérer une alerte par ID
router.get('/:id',
    requireRole(['admin', 'gerant', 'veterinaire', 'comptable']),
    alertController.getAlertById
);

// Route pour créer une nouvelle alerte
router.post('/',
    requireRole(['admin', 'veterinaire']),
    alertController.createAlert
);

// Route pour marquer une alerte comme lue
router.patch('/:id/read',
    requireRole(['admin', 'gerant', 'veterinaire', 'comptable']),
    alertController.markAsRead
);

// Route pour supprimer une alerte
router.delete('/:id',
    requireRole(['admin']),
    alertController.deleteAlert
);

// Route pour générer des alertes automatiques
router.post('/generate-automated',
    requireRole(['admin']),
    alertController.generateAutomatedAlerts
);

// Route pour récupérer les statistiques des alertes
router.get('/stats/summary',
    requireRole(['admin', 'gerant']),
    alertController.getAlertStats
);

export default router;