import mongoose from "mongoose";
import { ANIMAL_STATUS } from "../utils/constants.js";

const animalSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String,
      required: true
    },
    qrCode: {
      type: String,
      required: true
    },
    initialWeight: {
      type: Number,
      required: true,
      min: 0
    },
    currentWeight: {
      type: Number,
      default: null,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(ANIMAL_STATUS),
      default: ANIMAL_STATUS.VIVANT
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    entryDate: {
      type: Date,
      default: Date.now
    },
    exitDate: {
      type: Date,
      default: null
    },
    exitReason: {
      type: String,
      enum: ['mort', 'vendu', 'fin_cycle'],
      default: null
    },
    growthHistory: [{
      date: {
        type: Date,
        default: Date.now,
        required: true
      },
      weight: {
        type: Number,
        required: true,
        min: 0
      },
      notes: {
        type: String,
        default: ""
      }
    }],
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

// Index
// animalSchema.index({ campaignId: 1 });
// animalSchema.index({ qrCode: 1 }, { unique: true });
// animalSchema.index({ status: 1 });
// animalSchema.index({ campaignId: 1, status: 1 });

export default mongoose.model("Animal", animalSchema);
