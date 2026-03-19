// Schéma pour les prescriptions médicales des animaux
import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    // Référence à l'animal concerné
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Animal',
        required: true,
    },
    // Référence à la campagne
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign',
        required: true,
    },
    // Référence au vétérinaire qui prescrit
    veterinarian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Produits de santé prescrits
    prescribedProducts: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Health',
            required: true,
        },
        dosage: {
            amount: { type: Number, required: true },
            unit: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: Number, required: true },
        },
        quantity: { type: Number, required: true },
        cost: { type: Number, required: true },
        notes: { type: String, default: '' },
    }],
    // Diagnostic du vétérinaire
    diagnosis: {
        type: String,
        required: true,
    },
    // Symptômes observés
    symptoms: {
        type: [String],
        default: [],
    },
    // Date de prescription
    prescriptionDate: {
        type: Date,
        default: Date.now,
    },
    // Date de début du traitement
    startDate: {
        type: Date,
        required: true,
    },
    // Date de fin du traitement
    endDate: {
        type: Date,
        required: true,
    },
    // Statut de la prescription (active, terminée, annulée)
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active',
    },
    // Coût total de la prescription
    totalCost: {
        type: Number,
        required: true,
        min: 0,
    },
    // Notes supplémentaires
    notes: {
        type: String,
        default: '',
    },
    // Suivi des administrations (pour chaque produit)
    administrations: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Health',
        },
        date: { type: Date, required: true },
        administeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        notes: { type: String, default: '' },
    }],
}, { timestamps: true });

// Index pour optimiser les requêtes
prescriptionSchema.index({ animal: 1, status: 1 });
prescriptionSchema.index({ campaign: 1, prescriptionDate: 1 });
prescriptionSchema.index({ veterinarian: 1, prescriptionDate: -1 });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;