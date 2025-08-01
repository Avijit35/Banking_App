import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transctionType: String,
    transactionAmount: Number,
    reference: String,
    currentBalance: String,
    customerId: String,
    accountNo: String,
    branch: String,
    Key: String,
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
