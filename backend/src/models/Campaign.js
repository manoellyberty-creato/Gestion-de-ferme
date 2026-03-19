import mongoose from "mongoose";
import { CAMPAIGN_STATUS, CAMPAIGN_GOALS } from "../utils/constants.js";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    categoryId: {
      type: String,
      required: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    expectedEndDate: {
      type: Date,
      required: true
    },
    actualEndDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: Object.values(CAMPAIGN_STATUS),
      default: CAMPAIGN_STATUS.PREPARATION
    },
    goal: {
      type: String,
      enum: Object.values(CAMPAIGN_GOALS),
      required: true
    },
    // Métriques selon l'objectif
    goalMetrics: {
      targetWeight: Number,      // Production : poids cible
      targetAge: Number,         // Production : âge cible
      targetPrice: Number,       // Vente : prix cible
      targetVolume: Number,      // Vente : volume cible
      qualityStandards: String   // Standards qualité
    },
    budget: {
      type: Number,
      required: true,
      min: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    // Statistiques calculées
    initialCount: {
      type: Number,
      default: 0
    },
    currentCount: {
      type: Number,
      default: 0
    },
    deadCount: {
      type: Number,
      default: 0
    },
    soldCount: {
      type: Number,
      default: 0
    },
    // Assignations (table de liaison)
    assignedAgents: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      assignedAt: {
        type: Date,
        default: Date.now
      },
      role: {
        type: String,
        enum: ['agent', 'veterinaire'],
        required: true
      }
    }],
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Index
campaignSchema.index({ categoryId: 1 });
campaignSchema.index({ managerId: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ goal: 1 });

export default mongoose.model("Campaign", campaignSchema);