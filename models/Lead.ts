import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    status: {
      type: String,
      default: "New",
    },
    visitDate: String,
    activity: [String],
    priority: {
      type: String,
      default: "Medium",
    },
    score: Number,
  },
  { timestamps: true }
);


export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);