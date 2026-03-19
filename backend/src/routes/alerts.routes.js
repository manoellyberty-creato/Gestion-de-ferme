// Routes pour le système d'alertes
import express from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// Route pour récupérer les alertes générales
router.get('/',
    requireRole(['admin', 'responsable', 'veterinaire', 'comptable']),
    (req, res) => {
        // TODO: Implémenter la logique des alertes
        res.json({
            success: true,
            data: []
        });
    }
);

// Route pour marquer une alerte comme lue
router.patch('/:id/read',
    requireRole(['admin', 'responsable', 'veterinaire', 'comptable']),
    (req, res) => {
        // TODO: Implémenter la logique
        res.json({
            success: true,
            message: 'Alerte marquée comme lue'
        });
    }
);

export default router;