// Routes utilisateurs
import express from 'express';

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/', (req, res) => {
    res.json({
        success: true,
        data: []
    });
});

export default router;