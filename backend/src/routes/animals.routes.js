// Routes pour la gestion des animaux
import express from 'express';

const router = express.Router();

// Route pour récupérer tous les animaux
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

export default router;