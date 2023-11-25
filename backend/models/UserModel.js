import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    experience: { type: Number, default: 100, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isAuthor: { type: Boolean, default: false, required: true },
    image: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
