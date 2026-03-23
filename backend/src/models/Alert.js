// Schéma pour le système d'alertes
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    // Titre de l'alerte
    title: {
        type: String,
        required: true,
    },
    // Message détaillé
    message: {
        type: String,
        required: true,
    },
    // Type d'alerte
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info',
    },
    // Catégorie d'alerte
    category: {
        type: String,
        enum: ['health', 'feed', 'finance', 'animal', 'campaign', 'system'],
        required: true,
    },
    // Priorité
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
    },
    // Statut de lecture
    isRead: {
        type: Boolean,
        default: false,
    },
    // Date de lecture
    readAt: {
        type: Date,
    },
    // Utilisateur destinataire (null = tous les admins)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // Référence à l'entité concernée
    relatedEntity: {
        model: {
            type: String,
            enum: ['Animal', 'Campaign', 'Feed', 'Health', 'Transaction'],
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
        },
    },
    // Données supplémentaires
    metadata: {
        type: mongoose.Schema.Types.Mixed,
    },
    // Date d'expiration de l'alerte
    expiresAt: {
        type: Date,
    },
    // Statut actif
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Index pour optimiser les requêtes
alertSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
alertSchema.index({ category: 1, priority: 1 });
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;