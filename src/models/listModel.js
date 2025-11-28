import mongoose from "mongoose";

const ListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    archived: { type: Boolean, default: false },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        id: String,
        text: String,
        completed: Boolean
      }
    ],
    members: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        email: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("List", ListSchema);