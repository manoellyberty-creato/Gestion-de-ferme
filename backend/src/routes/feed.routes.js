// Routes pour la gestion de l'alimentation
import express from 'express';

const router = express.Router();

// Route pour récupérer les données d'alimentation
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

export default router;