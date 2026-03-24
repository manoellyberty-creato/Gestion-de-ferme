// Schéma pour l'alimentation des animaux
import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema({
    // Nom du produit d'alimentation
    name: {
        type: String,
        required: true,
    },
    // Type d'alimentation
    type: {
        type: String,
        enum: ['grain', 'concentrate', 'roughage', 'mineral', 'vitamin', 'medicated'],
        required: true,
    },
    // Description
    description: {
        type: String,
        default: '',
    },
    // Unité de mesure
    unit: {
        type: String,
        enum: ['kg', 'liters', 'sacks', 'bags'],
        required: true,
    },
    // Prix unitaire
    unitPrice: {
        type: Number,
        min: 0,
        required: true,
    },
    // Stock disponible
    stock: {
        type: Number,
        min: 0,
        default: 0,
    },
    // Stock minimum (alerte)
    minStock: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    // Date d'expiration
    expirationDate: {
        type: Date,
    },
    // Fournisseur
    supplier: {
        type: String,
        default: '',
        required: true
    },
    // Statut actif/inactif
    isActive: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true });

// Index pour optimiser les requêtes
feedSchema.index({ type: 1, isActive: 1 });
feedSchema.index({ expirationDate: 1 });

const Feed = mongoose.model('Feed', feedSchema);
export default Feed;