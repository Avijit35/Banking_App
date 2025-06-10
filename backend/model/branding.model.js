import mongoose, { Schema } from "mongoose";

const brandingSchema = new Schema(
  {
    bankName: String,
    bankTagline: String,
    bankLogo: String,
    bankAccountNo: String,
    bankTransactionId: String,
    bankAddress: String,
    bankLinkedin: String,
    bankTwitter: String,
    bankFacebook: String,
    bankDesc: String,
  },
  { timestamps: true }
);

export const Branding = mongoose.model("Branding", brandingSchema);
