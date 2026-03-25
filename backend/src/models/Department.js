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
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  { timestamps: true }
);

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema)
export default Department;