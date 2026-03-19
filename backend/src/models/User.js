// Schéma utilisateur
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    // Nom complet
    name: {
        type: String,
        required: true,
    },
    // Email (unique)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    // Mot de passe hashé
    password: {
        type: String,
        required: true,
    },
    // Rôle utilisateur
    role: {
        type: String,
        enum: ['admin', 'responsable', 'veterinaire', 'comptable', 'agent'],
        required: true,
    },
    // Téléphone
    phone: {
        type: String,
    },
    // Statut actif/inactif
    isActive: {
        type: Boolean,
        default: true,
    },
    // Dernière connexion
    lastLogin: {
        type: Date,
    },
    // Notes
    notes: {
        type: String,
        default: '',
    },
}, { timestamps: true });

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Index
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;