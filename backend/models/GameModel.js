import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    image_link: { type: String, required: true },
    price: { type: Number, required: true },
    average_rating: { type: Number, required: true },
    review_count: { type: Number, required: true },
    publisher: { type: String, required: true },
    discount: { type: Number, required: false },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
