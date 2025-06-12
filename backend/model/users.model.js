import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

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
    key: String,
    branch: String,
    address: String,
    userType: String,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

export const User = mongoose.model("User", userSchema);
