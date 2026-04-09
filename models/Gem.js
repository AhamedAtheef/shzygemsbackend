import mongoose from "mongoose";

const gemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  crt: Number,
  color: String,
  type: { type: String, enum: ["natural", "heated"] },

  images: [String],

  // ✅ NEW
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

const Gem = mongoose.model("Gem", gemSchema);
export default Gem;