// Fichier principal des routes de l'application
import authRoutes from './auth.routes.js';
import userRoutes from './users.routes.js';
import animalRoutes from './animals.routes.js';
import campaignRoutes from './campaigns.routes.js';
import feedRoutes from './feed.routes.js';
import healthRoutes from './health.routes.js';
import reportRoutes from './reports.routes.js';
import alertRoutes from './alerts.routes.js';
import meRoutes from './me.routes.js';
import { Router } from 'express';
const router = Router();
 
// Toutes les routes d'authentification seront préfixées par /auth
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
 

// Routes des animaux
router.use('/animals', animalRoutes);

// Routes des campagnes
router.use('/campaigns', campaignRoutes);

// Routes de l'alimentation
router.use('/feed', feedRoutes);

// Routes de santé (nouveau module)
router.use('/health', healthRoutes);

// Routes des rapports financiers (nouveau module)
router.use('/reports', reportRoutes);

// Routes des alertes
router.use('/alerts', alertRoutes);

// Routes personnelles (profil utilisateur)
router.use('/me', meRoutes);

export default router;
