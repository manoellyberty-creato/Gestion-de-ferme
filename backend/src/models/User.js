import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { USER_ROLES } from "../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    profile: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

// ==========================
// Middleware : hash password avant sauvegarde
// ==========================
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// ==========================
// Méthode d'instance : comparer mot de passe
// ==========================
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ==========================
// Index pour recherche rapide et unicité
// ==========================
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });

// ==========================
// Export du modèle
// ==========================
export default mongoose.model("User", userSchema);