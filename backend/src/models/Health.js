// Schéma pour les produits de santé (vaccins, traitements, suppléments)
import mongoose from 'mongoose';

const healthSchema = new mongoose.Schema({
    // Nom du produit de santé
    name: {
        type: String,
        required: true,
    },
    // Description détaillée du produit
    description: {
        type: String,
        required: true,
    },
    // Type de produit (vaccin, traitement, supplément, antibiotique, antiparasitaire)
    type: {
        type: String,
        enum: ['vaccine', 'treatment', 'supplement', 'antibiotic', 'antiparasitic'],
        required: true,
    },
    // Catégorie (préventif, curatif, nutritionnel)
    category: {
        type: String,
        enum: ['preventive', 'curative', 'nutritional'],
        required: true,
    },
    // Espèces cibles (volaille, bétail, poisson, etc.)
    targetSpecies: [{
        type: String,
        enum: ['poultry', 'cattle', 'fish', 'pigeon', 'duck', 'guinea_fowl', 'chicken', 'dairy_cattle', 'beef_cattle', 'sheep'],
        required: true,
    }],
    // Dosage recommandé
    dosage: {
        amount: { type: Number, required: true }, // Quantité
        unit: { type: String, required: true }, // Unité (mg, ml, unités, etc.)
        frequency: { type: String, required: true }, // Fréquence (quotidien, hebdomadaire, etc.)
        duration: { type: Number, required: true }, // Durée en jours
    },
    // Efficacité en pourcentage
    effectiveness: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    // Effets secondaires possibles
    sideEffects: {
        type: [String],
        default: [],
    },
    // Coût par unité
    unitPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    // Fournisseur du produit
    supplier: {
        type: String,
        required: true,
    },
    // Date d'expiration
    expirationDate: {
        type: Date,
        required: true,
    },
    // Numéro de lot
    batchNumber: {
        type: String,
        required: true,
    },
    // Statut actif/inactif
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Index pour optimiser les requêtes
healthSchema.index({ type: 1, targetSpecies: 1 });
healthSchema.index({ isActive: 1, expirationDate: 1 });

const Health = mongoose.model('Health', healthSchema);
export default Health;
