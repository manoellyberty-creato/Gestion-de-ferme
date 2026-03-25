// Contrôleur pour les rapports financiers et analyses
import reportService from '../services/report.service.js';
import feedService from '../services/feed.service.js';
import healthService from '../services/health.service.js';

class ReportController {
    // === GESTION DES TRANSACTIONS ===

    // Créer une transaction
    async createTransaction(req, res, next) {
        try {
            const transactionData = {
                ...req.body,
                recordedBy: req.user.id
            };
            const transaction = await reportService.createTransaction(transactionData);
            res.status(201).json({
                success: true,
                message: 'Transaction créée avec succès',
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer les transactions avec pagination et filtres
    async getTransactions(req, res, next) {
        try {
            const { page = 1, limit = 50, ...filters } = req.query;
            const result = await reportService.getTransactions(filters, parseInt(page), parseInt(limit));
            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    // Récupérer une transaction par ID
    async getTransactionById(req, res, next) {
        try {
            // Cette méthode n'existe pas encore dans le service, on utilise getTransactions avec un filtre
            const result = await reportService.getTransactions({ _id: req.params.id }, 1, 1);
            if (result.docs.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Transaction non trouvée'
                });
            }
            res.json({
                success: true,
                data: result.docs[0]
            });
        } catch (error) {
            next(error);
        }
    }

    // Mettre à jour une transaction
    async updateTransaction(req, res, next) {
        try {
            const transaction = await reportService.updateTransaction(req.params.id, req.body);
            res.json({
                success: true,
                message: 'Transaction mise à jour avec succès',
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    }

    // Supprimer une transaction
    async deleteTransaction(req, res, next) {
        try {
            const transaction = await reportService.deleteTransaction(req.params.id);
            res.json({
                success: true,
                message: 'Transaction supprimée avec succès',
                data: transaction
            });
        } catch (error) {
            next(error);
        }
    }

    // === RAPPORTS FINANCIERS ===

    // Rapport financier général
    async getFinancialSummary(req, res, next) {
        try {
            const { campaignId, startDate, endDate } = req.query;
            const summary = await reportService.getFinancialSummary(campaignId, startDate, endDate);
            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            next(error);
        }
    }

    // Rapport financier par campagne
    async getCampaignFinancialReport(req, res, next) {
        try {
            const report = await reportService.getCampaignFinancialReport(req.params.campaignId);
            res.json({
                success: true,
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    // Analyse des flux de trésorerie
    async getCashFlowAnalysis(req, res, next) {
        try {
            const { campaignId, period = 'monthly', startDate, endDate } = req.query;
            const cashFlow = await reportService.getCashFlowAnalysis(campaignId, period, startDate, endDate);
            res.json({
                success: true,
                data: cashFlow
            });
        } catch (error) {
            next(error);
        }
    }

    // Analyse des dépenses par catégorie
    async getExpenseAnalysis(req, res, next) {
        try {
            const { campaignId, startDate, endDate } = req.query;
            const analysis = await reportService.getExpenseAnalysis(campaignId, startDate, endDate);
            res.json({
                success: true,
                data: analysis
            });
        } catch (error) {
            next(error);
        }
    }

    // Calcul du ROI
    async calculateROI(req, res, next) {
        try {
            const roi = await reportService.calculateROI(req.params.campaignId);
            res.json({
                success: true,
                data: roi
            });
        } catch (error) {
            next(error);
        }
    }

    // Rapport budget vs dépenses réelles
    async getBudgetVsActualReport(req, res, next) {
        try {
            const report = await reportService.getBudgetVsActualReport(req.params.campaignId);
            res.json({
                success: true,
                data: report
            });
        } catch (error) {
            next(error);
        }
    }

    // === RAPPORTS DE VENTES ===

    // Rapport des ventes d'animaux
    async getAnimalSalesReport(req, res, next) {
        try {
            const { campaignId, startDate, endDate } = req.query;
            const filters = {
                type: 'income',
                category: 'sale_animal'
            };
            if (campaignId) filters.campaign = campaignId;
            if (startDate || endDate) {
                filters.startDate = startDate;
                filters.endDate = endDate;
            }

            const result = await reportService.getTransactions(filters, 1, 1000);
            res.json({
                success: true,
                data: result.docs
            });
        } catch (error) {
            next(error);
        }
    }

    // Rapport des ventes de produits
    async getProductSalesReport(req, res, next) {
        try {
            const { campaignId, startDate, endDate } = req.query;
            const filters = {
                type: 'income',
                category: { $in: ['sale_eggs', 'sale_meat', 'sale_feathers', 'sale_manure'] }
            };
            if (campaignId) filters.campaign = campaignId;
            if (startDate || endDate) {
                filters.startDate = startDate;
                filters.endDate = endDate;
            }

            const result = await reportService.getTransactions(filters, 1, 1000);
            res.json({
                success: true,
                data: result.docs
            });
        } catch (error) {
            next(error);
        }
    }

    // === TABLEAUX DE BORD ===

    // Tableau de bord général
    async getDashboardData(req, res, next) {
        try {
            const { campaignId } = req.query;

            // Récupérer les données en parallèle
            const [financialSummary, expenseAnalysis, cashFlow, feedStats, healthStats, lowStockFeeds, expiringFeeds, healthAlerts] = await Promise.all([
                reportService.getFinancialSummary(campaignId),
                reportService.getExpenseAnalysis(campaignId),
                reportService.getCashFlowAnalysis(campaignId, 'monthly'),
                feedService.getFeedStats(),
                healthService.getHealthStatistics(campaignId),
                feedService.getLowStockAlerts(),
                feedService.getExpiringSoon(),
                healthService.getHealthAlerts()
            ]);

            const alerts = [];
            if (lowStockFeeds?.length > 0) {
                alerts.push(`${lowStockFeeds.length} produits d'alimentation en rupture de stock`)   
            }
            if (expiringFeeds?.length > 0) {
                alerts.push(`${expiringFeeds.length} produits d'alimentation expirent prochainement`);
            }
            if (healthAlerts?.length > 0) {
                alerts.push(...healthAlerts.map(alert => alert.message || alert));
            }
            if (financialSummary?.netProfit < 0) {
                alerts.push('Bénéfice net négatif, vérifier les dépenses');
            }

            res.json({
                success: true,
                data: {
                    financialSummary,
                    expenseAnalysis,
                    cashFlow: cashFlow.slice(-6), // 6 derniers mois
                    feedStats,
                    healthStats,
                    alerts
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Métriques clés de performance (KPIs)
    async getKPIs(req, res, next) {
        try {
            const { campaignId } = req.query;

            const summary = await reportService.getFinancialSummary(campaignId);

            const kpis = {
                totalRevenue: summary.totalIncome,
                totalExpenses: summary.totalExpense,
                netProfit: summary.netProfit,
                profitMargin: summary.profitMargin,
                roi: campaignId ? await reportService.calculateROI(campaignId).then(r => r.roi) : null
            };

            res.json({
                success: true,
                data: kpis
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ReportController();