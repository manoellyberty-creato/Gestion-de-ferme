import mongoose from "mongoose";
import { DEPARTMENTS } from "../utils/constants.js";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: Object.values(DEPARTMENTS),
      unique: true
    },
    description: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Métadonnées spécifiques au département
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);