import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    accountNo: String,
    fullname: String,
    mobile: String,
    fatherName: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    dob: String,
    gender: String,
    currency: String,
    key: String,
    profile: String,
    signature: String,
    document: String,
    finalBalance: {
      type: Number,
      default: 0,
    },
    address: String,
    userType: String,
    branch: String,
    customerLoginId: String,
    createdBy: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Customer = mongoose.model("customer", customerSchema);
