// Routes pour la gestion de l'alimentation
import express from 'express';
import feedController from '../controllers/feed.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// Route pour récupérer tous les produits d'alimentation
router.get('/',
    requireRole(['admin', 'gerant', 'agent']),
    feedController.getAllFeeds
);

// Route pour récupérer un produit par ID
router.get('/:id',
    requireRole(['admin', 'gerant', 'agent', 'veterinaire']),
    feedController.getFeedById
);

// Route pour créer un nouveau produit d'alimentation
router.post('/',
    requireRole(['admin', 'gerant']),
    feedController.createFeed
);

// Route pour mettre à jour un produit d'alimentation
router.put('/:id',
    requireRole(['admin', 'gerant']),
    feedController.updateFeed
);

// Route pour mettre à jour le stock d'un produit
router.patch('/:id/stock',
    requireRole(['admin', 'gerant', 'agent']),
    feedController.updateStock
);

// Route pour désactiver un produit d'alimentation
router.patch('/:id/deactivate',
    requireRole(['admin', 'gerant']),
    feedController.deactivateFeed
);

// Route pour supprimer un produit d'alimentation
router.delete('/:id',
    requireRole(['admin']),
    feedController.deleteFeed
);

// Route pour récupérer les produits en rupture de stock
router.get('/alerts/low-stock',
    requireRole(['admin', 'gerant', 'agent']),
    feedController.getLowStockFeeds
);

// Route pour récupérer les produits expirant bientôt
router.get('/alerts/expiring-soon',
    requireRole(['admin', 'gerant', 'veterinaire']),
    feedController.getExpiringSoonFeeds
);

// Route pour récupérer les statistiques des produits d'alimentation
router.get('/stats/summary',
    requireRole(['admin', 'gerant', 'comptable']),
    feedController.getFeedStats
);

// Route pour rechercher des produits d'alimentation
router.get('/search',
    requireRole(['admin', 'gerant', 'agent', 'veterinaire']),
    feedController.searchFeeds
);

export default router;