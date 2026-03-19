// Routes pour la gestion des campagnes
import express from 'express';

const router = express.Router();

// Route pour récupérer toutes les campagnes
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

export default router;