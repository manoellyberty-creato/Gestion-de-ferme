// Schéma pour les animaux individuels
import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
    // Nom de l'animal
    name: {
        type: String,
        required: true,
    },
    // Numéro de tag/identification
    tagNumber: {
        type: String,
        required: true,
        unique: true,
    },
    // Espèce
    species: {
        type: String,
        enum: ['poultry', 'cattle', 'fish', 'pigeon', 'duck', 'guinea_fowl', 'chicken', 'dairy_cattle', 'beef_cattle', 'sheep'],
        required: true,
    },
    // Race/souche
    breed: {
        type: String,
        required: true,
    },
    // Sexe
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    // Date de naissance
    birthDate: {
        type: Date,
        required: true,
    },
    // Poids actuel en kg
    weight: {
        type: Number,
        min: 0,
    },
    // Statut de santé général
    healthStatus: {
        type: String,
        enum: ['healthy', 'sick', 'critical', 'recovered'],
        default: 'healthy',
    },
    // Référence à la campagne
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    // Statut (actif, vendu, mort, etc.)
    status: {
        type: String,
        enum: ['active', 'sold', 'dead', 'culled'],
        default: 'active',
    },
    // Prix d'achat
    purchasePrice: {
        type: Number,
        min: 0,
    },
    // Prix de vente (si vendu)
    salePrice: {
        type: Number,
        min: 0,
    },
    // Date de vente
    saleDate: {
        type: Date,
    },
    // Notes supplémentaires
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Index pour optimiser les requêtes
animalSchema.index({ campaign: 1, species: 1 });
animalSchema.index({ status: 1 });

const Animal = mongoose.model('Animal', animalSchema);
export default Animal;