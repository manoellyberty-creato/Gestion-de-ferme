// User management routes

import express from 'express';
import * as userCtrl from '../controllers/user.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';

const router = express.Router();

// Toutes les routes ici demandent d'être Admin
router.use(requireAuth);
router.use(requireRole('admin'));

router.get('/', userCtrl.getUsers);           // Voir tout le monde
router.post('/', userCtrl.addUser);           // Créer un user
router.put('/:id', userCtrl.editUser);           //Modifier un user
router.delete('/:id', userCtrl.removeUser);   // Supprimer un user

export default router;