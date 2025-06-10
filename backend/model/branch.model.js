import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema(
  {
    branchName: {
      type: String,
      unique: true,
    },
    branchAddress: String,
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", branchSchema);
