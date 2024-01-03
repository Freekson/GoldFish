import express from "express";
import { isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import Article from "../models/ArticleModel.js";
import Comment from "../models/CommentModel.js";

const commentRouter = express.Router();

commentRouter.post(
  "/:articleId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.articleId;
    const { content } = req.body;
    const userId = req.user._id;

    try {
      const article = await Article.findById(articleId);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      const comment = new Comment({
        content,
        author: userId,
      });

      await comment.save();
      if (!article.comments) {
        article.comments = [];
      }
      article.comments.push(comment._id);
      await article.save();

      res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

commentRouter.get(
  "/:articleId",
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.articleId;

    try {
      const article = await Article.findById(articleId).populate({
        path: "comments",
        populate: {
          path: "replies",
        },
      });

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      const comments = article.comments;

      res.status(200).json({ comments });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

export default commentRouter;
