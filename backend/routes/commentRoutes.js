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
        articleId: articleId,
      });

      await comment.save();

      if (!Array.isArray(article.comments)) {
        article.comments = [];
      }

      article.comments.push(comment._id);
      await article.save();

      res.status(201).json({ message: "Comment added", comment });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

commentRouter.get(
  "/:articleId",
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.articleId;

    try {
      const comments = await Comment.find({ articleId: articleId })
        .populate({
          path: "author",
          model: "User",
        })
        .populate({
          path: "replies",
          populate: {
            path: "author",
            model: "User",
          },
        })
        .sort({ createdAt: -1 })
        .exec();

      if (!comments) {
        return res.status(404).json({ message: "Comments not found" });
      }

      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

commentRouter.put(
  "/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const { content } = req.body;
    const userId = req.user._id;

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to edit this comment" });
      }

      comment.content = content;
      comment.updatedAt = new Date();
      await comment.save();

      res.status(200).json({ message: "Comment edited", comment });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

commentRouter.delete(
  "/:commentId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.commentId;
    const userId = req.user._id;

    try {
      const comment = await Comment.findById(commentId);

      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.author.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this comment" });
      }

      await comment.deleteOne({ _id: commentId });

      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

commentRouter.post(
  "/like/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);

    if (comment) {
      if (comment.dislikedBy.includes(userId)) {
        comment.dislikedBy.pull(userId);
      }

      if (!comment.likedBy.includes(userId)) {
        comment.likedBy.push(userId);
      }

      await comment.save();
      res.status(200).json({ message: "User liked the comment", comment });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  })
);

commentRouter.post(
  "/dislike/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);

    if (comment) {
      if (comment.likedBy.includes(userId)) {
        comment.likedBy.pull(userId);
      }

      if (!comment.dislikedBy.includes(userId)) {
        comment.dislikedBy.push(userId);
      }

      await comment.save();
      res.status(200).json({ message: "User disliked the comment", comment });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  })
);

commentRouter.post(
  "/report/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const commentId = req.params.id;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);

    if (comment) {
      comment.reportedBy.push(userId);

      await comment.save();
      res.status(200).json({ message: "Comment reported", comment });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  })
);

export default commentRouter;