import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    campaignId: {
      type: String, 
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["mortality", "weight_loss", "disease"],
      required: true
    },

    level: {
      type: String,
      enum: ["info", "warning", "danger"],
      default: "warning",
      index: true
    },

    message: {
      type: String,
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
      index: true
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    resolvedAt: {
      type: Date,
      default: null
    },

    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// alertSchema.index({ campaignId: 1, type: 1 });
// alertSchema.index({ createdAt: -1 });

export default mongoose.model("Alert", alertSchema);
