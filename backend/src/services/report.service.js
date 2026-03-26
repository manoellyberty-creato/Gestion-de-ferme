// Service pour les rapports financiers et analyses
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Campaign from '../models/Campaign.js';
import Animal from '../models/Animal.js';

class ReportService {
    // === GESTION DES TRANSACTIONS ===

    // Créer une nouvelle transaction
    async createTransaction(transactionData) {
        try {
            console.log('Création transaction avec données:', transactionData);

            // Validation basique
            if (!transactionData.type || !['income', 'expense'].includes(transactionData.type)) {
                throw new Error('Type de transaction invalide');
            }
            if (!transactionData.category) {
                throw new Error('Catégorie requise');
            }
            if (!transactionData.amount || transactionData.amount <= 0) {
                throw new Error('Montant invalide');
            }
            if (!transactionData.description) {
                throw new Error('Description requise');
            }

            const transaction = new Transaction(transactionData);
            await transaction.save();
            return transaction;
        } catch (error) {
            console.error('Erreur service createTransaction:', error.message);
            throw new Error(`Erreur lors de la création de la transaction: ${error.message}`);
        }
    }

    // Récupérer les transactions avec filtres
    async getTransactions(filters = {}, page = 1, limit = 50) {
        try {
            const query = {};

            // Appliquer les filtres
            if (filters.type) query.type = filters.type;
            if (filters.category) query.category = filters.category;
            if (filters.campaign) query.campaign = filters.campaign;
            if (filters.status) query.status = filters.status;
            if (filters.startDate || filters.endDate) {
                query.date = {};
                if (filters.startDate) query.date.$gte = new Date(filters.startDate);
                if (filters.endDate) query.date.$lte = new Date(filters.endDate);
            }

            // Pagination manuelle
            const skip = (page - 1) * limit;
            const total = await Transaction.countDocuments(query);
            const transactions = await Transaction.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .populate([
                    { path: 'campaign', select: 'name startDate endDate' },
                    { path: 'recordedBy', select: 'name email' },
                    { path: 'animal', select: 'name tagNumber species' }
                ]);

            return {
                docs: transactions,
                totalDocs: total,
                limit: limit,
                page: page,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
                nextPage: page * limit < total ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des transactions: ${error.message}`);
        }
    }

    // Mettre à jour une transaction
    async updateTransaction(id, updateData) {
        try {
            const transaction = await Transaction.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!transaction) {
                throw new Error('Transaction non trouvée');
            }
            return transaction;
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la transaction: ${error.message}`);
        }
    }

    // Supprimer une transaction
    async deleteTransaction(id) {
        try {
            const transaction = await Transaction.findByIdAndDelete(id);
            if (!transaction) {
                throw new Error('Transaction non trouvée');
            }
            return transaction;
        } catch (error) {
            throw new Error(`Erreur lors de la suppression de la transaction: ${error.message}`);
        }
    }

    // === RAPPORTS FINANCIERS ===

    // Rapport financier général
    async getFinancialSummary(campaignId = null, startDate = null, endDate = null) {
        try {
            const matchConditions = {};
            if (campaignId) matchConditions.campaign = campaignId;
            if (startDate || endDate) {
                matchConditions.date = {};
                if (startDate) matchConditions.date.$gte = new Date(startDate);
                if (endDate) matchConditions.date.$lte = new Date(endDate);
            }

            const summary = await Transaction.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: {
                            type: '$type',
                            category: '$category'
                        },
                        total: { $sum: '$amount' },
                        count: { $sum: 1 }
                    }
                },
                {
                    $group: {
                        _id: '$_id.type',
                        categories: {
                            $push: {
                                category: '$_id.category',
                                total: '$total',
                                count: '$count'
                            }
                        },
                        totalAmount: { $sum: '$total' }
                    }
                }
            ]);

            // Calculer les totaux généraux
            let totalIncome = 0;
            let totalExpense = 0;

            summary.forEach(group => {
                if (group._id === 'income') {
                    totalIncome = group.totalAmount;
                } else if (group._id === 'expense') {
                    totalExpense = group.totalAmount;
                }
            });

            return {
                totalIncome,
                totalExpense,
                netProfit: totalIncome - totalExpense,
                profitMargin: totalExpense > 0 ? ((totalIncome - totalExpense) / totalExpense) * 100 : 0,
                details: summary
            };
        } catch (error) {
            throw new Error(`Erreur lors du calcul du résumé financier: ${error.message}`);
        }
    }

    // Rapport par campagne
    async getCampaignFinancialReport(campaignId) {
        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                throw new Error('Campagne non trouvée');
            }

            const summary = await this.getFinancialSummary(campaignId, campaign.startDate, campaign.endDate);

            // Statistiques des animaux
            const animalStats = await Animal.aggregate([
                { $match: { campaign: campaignId } },
                {
                    $group: {
                        _id: '$species',
                        count: { $sum: 1 },
                        totalWeight: { $sum: '$weight' },
                        averageWeight: { $avg: '$weight' }
                    }
                }
            ]);

            return {
                campaign: {
                    id: campaign._id,
                    name: campaign.name,
                    startDate: campaign.startDate,
                    endDate: campaign.endDate,
                    status: campaign.status
                },
                financials: summary,
                animalStats
            };
        } catch (error) {
            throw new Error(`Erreur lors du rapport de campagne: ${error.message}`);
        }
    }

    // Analyse des flux de trésorerie
    async getCashFlowAnalysis(campaignId = null, period = 'monthly', startDate = null, endDate = null) {
        try {
            const matchConditions = {};
            if (campaignId) matchConditions.campaign = campaignId;
            if (startDate || endDate) {
                matchConditions.date = {};
                if (startDate) matchConditions.date.$gte = new Date(startDate);
                if (endDate) matchConditions.date.$lte = new Date(endDate);
            }

            let groupBy;
            switch (period) {
                case 'daily':
                    groupBy = {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    };
                    break;
                case 'weekly':
                    groupBy = {
                        $dateToString: { format: '%Y-%U', date: '$date' }
                    };
                    break;
                case 'monthly':
                default:
                    groupBy = {
                        $dateToString: { format: '%Y-%m', date: '$date' }
                    };
                    break;
            }

            const cashFlow = await Transaction.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: groupBy,
                        income: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                            }
                        },
                        expense: {
                            $sum: {
                                $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                            }
                        },
                        transactions: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        period: '$_id',
                        income: 1,
                        expense: 1,
                        netCashFlow: { $subtract: ['$income', '$expense'] },
                        transactions: 1
                    }
                },
                { $sort: { period: 1 } }
            ]);

            return cashFlow;
        } catch (error) {
            throw new Error(`Erreur lors de l'analyse des flux de trésorerie: ${error.message}`);
        }
    }

    // Analyse des catégories de dépenses
    async getExpenseAnalysis(campaignId = null, startDate = null, endDate = null) {
        try {
            const matchConditions = { type: 'expense' };
            if (campaignId) matchConditions.campaign = campaignId;
            if (startDate || endDate) {
                matchConditions.date = {};
                if (startDate) matchConditions.date.$gte = new Date(startDate);
                if (endDate) matchConditions.date.$lte = new Date(endDate);
            }

            const expenses = await Transaction.aggregate([
                { $match: matchConditions },
                {
                    $group: {
                        _id: '$category',
                        total: { $sum: '$amount' },
                        count: { $sum: 1 },
                        average: { $avg: '$amount' }
                    }
                },
                {
                    $project: {
                        category: '$_id',
                        total: 1,
                        count: 1,
                        average: 1,
                        percentage: 0 // Sera calculé après
                    }
                },
                { $sort: { total: -1 } }
            ]);

            // Calculer les pourcentages
            const totalExpenses = expenses.reduce((sum, exp) => sum + exp.total, 0);
            expenses.forEach(exp => {
                exp.percentage = totalExpenses > 0 ? (exp.total / totalExpenses) * 100 : 0;
            });

            return {
                totalExpenses,
                categories: expenses
            };
        } catch (error) {
            throw new Error(`Erreur lors de l'analyse des dépenses: ${error.message}`);
        }
    }

    // Calcul du ROI (Retour sur Investissement)
    async calculateROI(campaignId) {
        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                throw new Error('Campagne non trouvée');
            }

            const revenues = await Transaction.getTotalByType('income', campaignId, campaign.startDate, campaign.endDate);
            const expenses = await Transaction.getTotalByType('expense', campaignId, campaign.startDate, campaign.endDate);

            const roi = expenses > 0 ? ((revenues - expenses) / expenses) * 100 : 0;

            return {
                campaignId,
                campaignName: campaign.name,
                period: {
                    start: campaign.startDate,
                    end: campaign.endDate
                },
                revenues,
                expenses,
                netProfit: revenues - expenses,
                roi: roi,
                status: roi > 0 ? 'profitable' : roi < 0 ? 'loss' : 'break_even'
            };
        } catch (error) {
            throw new Error(`Erreur lors du calcul du ROI: ${error.message}`);
        }
    }

    // Rapport de budget vs dépenses réelles
    async getBudgetVsActualReport(campaignId) {
        try {
            // Récupérer la campagne avec son budget
            const campaign = await mongoose.model('Campaign').findById(campaignId);
            if (!campaign) {
                throw new Error('Campagne non trouvée');
            }

            // Récupérer les dépenses réelles
            const actualExpenses = await this.getExpenseAnalysis(campaignId);

            // Calculer la variance
            let variance = null;
            let variancePercentage = null;

            if (campaign.budget && actualExpenses.total > 0) {
                variance = campaign.budget - actualExpenses.total;
                variancePercentage = ((variance / campaign.budget) * 100);
            }

            return {
                campaignId,
                campaignName: campaign.name,
                budget: campaign.budget || 0,
                actual: actualExpenses.total,
                variance: variance,
                variancePercentage: variancePercentage,
                status: variance !== null ?
                    (variance >= 0 ? 'under_budget' : 'over_budget') : 'no_budget_set',
                details: actualExpenses
            };
        } catch (error) {
            throw new Error(`Erreur lors du rapport budget vs réel: ${error.message}`);
        }
    }
}

export default new ReportService();