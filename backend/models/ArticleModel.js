import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    tags: [{ type: String }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
