import { Router } from 'express';
import * as authCtrl from '../controllers/auth.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js'; // Import du petit nouveau

const router = Router();

// --- ROUTES PUBLIQUES ---

// Inscription d'un nouvel utilisateur
router.post('/register', authCtrl.register);

// Connexion et génération du token JWT
router.post('/login', authCtrl.login);


// --- ROUTES PROTÉGÉES (Nécessite d'être connecté) ---

// Récupérer son propre profil (Utilise le token pour identifier l'user)
router.get('/me', requireAuth, authCtrl.getProfile);


// --- ROUTES PRIVÉES (Exemples de contrôle par rôle) ---

// Exemple : Seul l'Admin peut voir tous les utilisateurs
router.get('/admin/all-users', 
    requireAuth, 
    requireRole(['admin']), 
    (req, res) => res.json({ message: "Liste des users (Admin only)" })
);

// Exemple : Seul le Vétérinaire ou l'Admin accède aux soins
router.get('/health/dashboard', 
    requireAuth, 
    requireRole(['admin', 'veterinaire']), 
    (req, res) => res.json({ message: "Espace Santé (Veto/Admin only)" })
);

// Exemple : Seul le Comptable ou l'Admin accède aux finances
router.get('/finance/reports', 
    requireAuth, 
    requireRole(['admin', 'comptable']), 
    (req, res) => res.json({ message: "Rapports financiers (Compta/Admin only)" })
);

export default router;