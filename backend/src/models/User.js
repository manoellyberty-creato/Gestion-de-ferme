// User schema (admin, responsable, agent, vétérinaire, comptable)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'manager', 'agent', 'veterinaire', 'comptable'], 
        default: 'agent' 
    },
    isActive: {
    type: Boolean,
    default: true
    },
    department: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
