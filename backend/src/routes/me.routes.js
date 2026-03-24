// Routes pour le profil utilisateur
import express from 'express';

const router = express.Router();

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: {}
    });
});

export default router;
