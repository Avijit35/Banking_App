import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transctionType: String,
    transactionAmount: String,
    reference: String,
    currentBalance: String,
    customerId: String,
    accountNo: String,
    Key: String,
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
