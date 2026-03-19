// Routes d'authentification
import express from 'express';

const router = express.Router();

// Route de connexion
router.post('/login', (req, res) => {
    // TODO: Implémenter la logique d'authentification
    res.json({
        success: true,
        message: 'Authentification à implémenter'
    });
});

// Route d'inscription
router.post('/register', (req, res) => {
    // TODO: Implémenter la logique d'inscription
    res.json({
        success: true,
        message: 'Inscription à implémenter'
    });
});

export default router;