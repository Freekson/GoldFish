import express from "express";
import expressAsyncHandler from "express-async-handler";
import Reply from "../models/ReplyModel.js";
import Comment from "../models/CommentModel.js";
import { isAuth } from "../utils.js";

const replyRouter = express.Router();

replyRouter.post(
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

      const reply = new Reply({
        content,
        author: userId,
        parentComment: commentId,
      });

      await reply.save();

      comment.replies.push(reply._id);
      await comment.save();

      res.status(201).json({ message: "Reply added", reply });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);

replyRouter.put(
  "/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const replyId = req.params.replyId;
    const { content } = req.body;

    try {
      const reply = await Reply.findById(replyId);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      if (reply.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You don't have permission to edit this reply" });
      }

      reply.content = content;
      await reply.save();

      res.status(200).json({ message: "Reply updated", reply });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

replyRouter.delete(
  "/:replyId",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const replyId = req.params.replyId;

    try {
      const reply = await Reply.findById(replyId);

      if (!reply) {
        return res.status(404).json({ message: "Reply not found" });
      }

      if (reply.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "You don't have permission to delete this reply" });
      }

      await reply.deleteOne({ _id: replyId });

      res.status(200).json({ message: "Reply deleted" });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

replyRouter.post(
  "/like/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const replyId = req.params.id;
    const { userId } = req.body;

    const reply = await Reply.findById(replyId);

    if (reply) {
      if (reply.dislikedBy.includes(userId)) {
        reply.dislikedBy.pull(userId);
      }

      if (!reply.likedBy.includes(userId)) {
        reply.likedBy.push(userId);
      }

      await reply.save();
      res.status(200).json({ message: "User liked the reply", reply });
    } else {
      res.status(404).json({ message: "Reply not found" });
    }
  })
);

replyRouter.post(
  "/dislike/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const replyId = req.params.id;
    const { userId } = req.body;

    const reply = await Reply.findById(replyId);

    if (reply) {
      if (reply.likedBy.includes(userId)) {
        reply.likedBy.pull(userId);
      }

      if (!reply.dislikedBy.includes(userId)) {
        reply.dislikedBy.push(userId);
      }

      await reply.save();
      res.status(200).json({ message: "User disliked the reply", reply });
    } else {
      res.status(404).json({ message: "Reply not found" });
    }
  })
);

replyRouter.post(
  "/report/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const replyId = req.params.id;
    const { userId } = req.body;

    const reply = await Reply.findById(replyId);

    if (reply) {
      reply.reportedBy.pull(userId);

      await reply.save();
      res.status(200).json({ message: "Reply reported", reply });
    } else {
      res.status(404).json({ message: "Reply not found" });
    }
  })
);

export default replyRouter;
