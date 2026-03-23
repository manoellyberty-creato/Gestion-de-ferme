import mongoose from "mongoose";
import { DEPARTMENTS } from "../utils/constants.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      enum: Object.values(DEPARTMENTS),
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

// Index composé pour éviter doublons
// categorySchema.index({ name: 1, department: 1 }, { unique: true });
// categorySchema.index({ department: 1 });

export default mongoose.model("Category", categorySchema);