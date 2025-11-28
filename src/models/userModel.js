import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profile: {
      type: String,
      default: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);