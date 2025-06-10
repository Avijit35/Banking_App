import mongoose, { Schema } from "mongoose";

const currencySchema = new Schema(
  {
    currencyName: {
      type: String,
      unique: true,
    },
    key: String,
    currencyDesc: String,
  },
  { timestamps: true }
);

export const Currency = mongoose.model("Currency", currencySchema);
