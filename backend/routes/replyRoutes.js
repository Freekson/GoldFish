import express from "express";
import expressAsyncHandler from "express-async-handler";
import Reply from "../models/ReplyModel.js";
import Comment from "../models/CommentModel.js";
import { isAuth } from "../utils.js";

const replyRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Replies
 *   description: API for managing replies
 */

/**
 * @swagger
 * /api/replies/{commentId}:
 *   post:
 *     summary: Add a reply to a comment by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to add a reply to a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of the comment to which the reply will be added.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "This is a reply."
 *     responses:
 *       201:
 *         description: Successful request. Returns a success message and the added reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply added"
 *               reply: { replyObject }
 *       404:
 *         description: Comment not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/replies/{replyId}:
 *   put:
 *     summary: Update a reply by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to update a reply by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: replyId
 *         in: path
 *         description: ID of the reply to be updated.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Updated reply content."
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the updated reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply updated"
 *               reply: { replyObject }
 *       403:
 *         description: You don't have permission to edit this reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "You don't have permission to edit this reply"
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/replies/{replyId}:
 *   delete:
 *     summary: Delete a reply by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to delete a reply by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: replyId
 *         in: path
 *         description: ID of the reply to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply deleted"
 *       403:
 *         description: You don't have permission to delete this reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "You don't have permission to delete this reply"
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/replies/like/{id}:
 *   post:
 *     summary: Like a reply by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to like a reply by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reply to be liked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user1Id"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the liked reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "User liked the reply"
 *               reply: { replyObject }
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/replies/dislike/{id}:
 *   post:
 *     summary: Dislike a reply by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to dislike a reply by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reply to be disliked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user1Id"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the disliked reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "User disliked the reply"
 *               reply: { replyObject }
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/replies/report/{id}:
 *   post:
 *     summary: Report a reply by ID.
 *     tags: [Replies]
 *     description: >
 *       This route allows an authenticated user to report a reply by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the reply to be reported.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "user1Id"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the reported reply.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply reported"
 *               reply: { replyObject }
 *       404:
 *         description: Reply not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Reply not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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
