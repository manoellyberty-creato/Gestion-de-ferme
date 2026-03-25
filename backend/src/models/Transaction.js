// Schéma pour les transactions financières
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    // Type de transaction (revenu ou dépense)
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    // Catégorie de la transaction
    category: {
        type: String,
        enum: [
            // Revenus
            "Vente d'animaux", "Vente d'œufs", "Vente de viande", "Vente de plumes", "Vente de fumier",
            "Subventions", "Investissements", "Prêts",
            // Dépenses
            "Alimentation", "Santé animale", "Main d'œuvre", "Équipement", "Maintenance", "Services publics",
            "Transport", "Assurance", "Taxes", "Autres dépenses"
        ],
        required: true,
    },
    // Montant de la transaction
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    // Devise (XAF par défaut)
    currency: {
        type: String,
        default: 'XOF',
    },
    // Description détaillée
    description: {
        type: String,
        required: true,
    },
    // Date de la transaction
    date: {
        type: Date,
        default: Date.now,
    },
    // Référence à la campagne si applicable
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
    },
    // Utilisateur qui enregistre la transaction
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Statut de validation (pour workflow d'approbation)
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'approved', // Par défaut approuvé pour simplifier
    },
    // Documents justificatifs (URLs ou chemins)
    documents: [{
        type: String,
    }],
    // Notes supplémentaires
    notes: {
        type: String,
        default: '',
    },
    // Pour les ventes d'animaux : référence à l'animal
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
    },
    // Quantité vendue (pour les produits comme œufs, viande)
    quantity: {
        type: Number,
        min: 0,
    },
    // Prix unitaire
    unitPrice: {
        type: Number,
        min: 0,
    },
    // Client ou fournisseur
    counterparty: {
        name: { type: String },
        contact: { type: String },
        address: { type: String },
    },
    // Taxes appliquées
    taxes: {
        rate: { type: Number, min: 0, max: 100 }, // Taux en pourcentage
        amount: { type: Number, min: 0 }, // Montant de la taxe
    },
}, { timestamps: true });

// Index pour optimiser les requêtes
transactionSchema.index({ type: 1, category: 1, date: -1 });
transactionSchema.index({ campaign: 1, date: -1 });
transactionSchema.index({ status: 1, date: -1 });

// Méthodes statiques pour les calculs financiers
transactionSchema.statics.getTotalByType = async function(type, campaignId = null, startDate = null, endDate = null) {
    const match = { type };
    if (campaignId) match.campaign = campaignId;
    if (startDate || endDate) {
        match.date = {};
        if (startDate) match.date.$gte = startDate;
        if (endDate) match.date.$lte = endDate;
    }

    const result = await this.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return result.length > 0 ? result[0].total : 0;
};

transactionSchema.statics.getROI = async function(campaignId, startDate, endDate) {
    const revenues = await this.getTotalByType('income', campaignId, startDate, endDate);
    const expenses = await this.getTotalByType('expense', campaignId, startDate, endDate);

    if (expenses === 0) return 0;
    return ((revenues - expenses) / expenses) * 100;
};

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;