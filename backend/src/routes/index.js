import { Router } from 'express';
import authRoutes from './auth.routes.js';

const router = Router();

// Toutes les routes d'authentification seront préfixées par /auth
router.use('/auth', authRoutes);

// Tu pourras ajouter les autres ici plus tard
// router.use('/campaigns', campaignRoutes);

export default router; // <--- C'est ce "default" qui manque !