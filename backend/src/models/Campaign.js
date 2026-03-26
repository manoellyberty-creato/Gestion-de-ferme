import mongoose from "mongoose";
import { CAMPAIGN_STATUS, CAMPAIGN_GOALS } from "../utils/constants.js";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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

    goalMetrics: {
      targetWeight: Number,
      targetAge: Number,
      targetPrice: Number,
      targetVolume: Number,
      qualityStandards: String
    },

    speciesCategories: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        animalCount: {
          type: Number,
          required: true,
          min: 1
        },
        generatedCount: {
          type: Number,
          default: 0
        }
      }
    ],

    budget: {
      type: Number,
      required: true,
      min: 0
    },

    totalCost: {
      type: Number,
      default: 0
    },

    assignedAgents: [
      {
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
          enum: ["agent","manager","veterinaire","comptable"],
          required: true
        }
      }
    ],

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

// Index
campaignSchema.index({ name: 1 }, { unique: true })
// campaignSchema.index({ categoryId: 1 });
// campaignSchema.index({ managerId: 1 });
// campaignSchema.index({ status: 1 });
// campaignSchema.index({ goal: 1 });

export default mongoose.model("Campaign", campaignSchema);
