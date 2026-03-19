// Schéma pour les campagnes d'élevage
import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
    // Nom de la campagne
    name: {
        type: String,
        required: true,
    },
    // Description
    description: {
        type: String,
        required: true,
    },
    // Type d'élevage
    type: {
        type: String,
        enum: ['poultry', 'cattle', 'fish', 'mixed'],
        required: true,
    },
    // Date de début
    startDate: {
        type: Date,
        required: true,
    },
    // Date de fin prévue
    endDate: {
        type: Date,
        required: true,
    },
    // Date de fin réelle
    actualEndDate: {
        type: Date,
    },
    // Statut de la campagne
    status: {
        type: String,
        enum: ['planning', 'active', 'completed', 'cancelled'],
        default: 'planning',
    },
    // Responsable de la campagne
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Budget prévu
    budget: {
        type: Number,
        min: 0,
    },
    // Objectifs de production
    targets: {
        animalCount: { type: Number, min: 0 },
        averageWeight: { type: Number, min: 0 },
        expectedRevenue: { type: Number, min: 0 },
    },
    // Localisation
    location: {
        farm: { type: String },
        sector: { type: String },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number },
        },
    },
    // Notes supplémentaires
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Index pour optimiser les requêtes
campaignSchema.index({ status: 1, startDate: -1 });
campaignSchema.index({ manager: 1 });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;