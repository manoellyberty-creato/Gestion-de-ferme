import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  espece: { type: String, required: true },
  race: { type: String },
  age: { type: Number },
  statut: { type: String, default: 'En forme' },
  qrCode: { type: String },
  // Lien vers le département
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department',
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Animal', animalSchema);