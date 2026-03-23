// Routes pour les rapports financiers et analyses
import express from 'express';
import reportController from '../controllers/report.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(requireAuth);

// === ROUTES POUR LES TRANSACTIONS ===
// Gestion des transactions (principalement pour comptables et admins)
router.post('/transactions',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.createTransaction
);

router.get('/transactions',
    requireRole(['comptable', 'admin', 'responsable', 'veterinaire']),
    reportController.getTransactions
);

router.get('/transactions/:id',
    requireRole(['comptable', 'admin', 'responsable', 'veterinaire']),
    reportController.getTransactionById
);

router.put('/transactions/:id',
    requireRole(['comptable', 'admin']),
    reportController.updateTransaction
);

router.delete('/transactions/:id',
    requireRole(['comptable', 'admin']),
    reportController.deleteTransaction
);

// === ROUTES POUR LES RAPPORTS FINANCIERS ===
// Rapport financier général
router.get('/financial-summary',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getFinancialSummary
);

// Rapport financier par campagne
router.get('/campaigns/:campaignId/financial',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getCampaignFinancialReport
);

// Analyse des flux de trésorerie
router.get('/cash-flow',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getCashFlowAnalysis
);

// Analyse des dépenses par catégorie
router.get('/expenses/analysis',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getExpenseAnalysis
);

// Calcul du ROI
router.get('/campaigns/:campaignId/roi',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.calculateROI
);

// Rapport budget vs dépenses réelles
router.get('/campaigns/:campaignId/budget-vs-actual',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getBudgetVsActualReport
);

// === ROUTES POUR LES RAPPORTS DE VENTES ===
// Rapport des ventes d'animaux
router.get('/sales/animals',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getAnimalSalesReport
);

// Rapport des ventes de produits
router.get('/sales/products',
    requireRole(['comptable', 'admin', 'responsable']),
    reportController.getProductSalesReport
);

// === ROUTES POUR LES TABLEAUX DE BORD ===
// Tableau de bord général
router.get('/dashboard',
    requireRole(['admin', 'responsable', 'comptable']),
    reportController.getDashboardData
);

// Métriques clés de performance (KPIs)
router.get('/kpis',
    requireRole(['admin', 'responsable', 'comptable']),
    reportController.getKPIs
);

export default router;