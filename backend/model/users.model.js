import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: String,
    mobile: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    profile: String,
    address: String,
    userType: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
