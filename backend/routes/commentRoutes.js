import express from "express";
import { isAuth, isAuthor } from "../utils.js";
import mongoose from "mongoose";
import expressAsyncHandler from "express-async-handler";
import Article from "../models/ArticleModel.js";
import Comment from "../models/CommentModel.js";
import Reply from "../models/ReplyModel.js";

const commentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API for managing comments
 */

/**
 * @swagger
 * /comments/summary:
 *   get:
 *     summary: Get a summary of comments and replies for articles authored by the user.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated author to get a summary of comments and replies for articles they authored.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful request. Returns a summary of comments and replies.
 *         content:
 *           application/json:
 *             example:
 *               totalComments: 30
 *               totalReplies: 15
 *               commentsSummary:
 *                 - _id: "2022-01-01"
 *                   comments: 5
 *                 - _id: "2022-01-02"
 *                   comments: 10
 *               repliesSummary:
 *                 - _id: "2022-01-01"
 *                   replies: 2
 *                 - _id: "2022-01-02"
 *                   replies: 5
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

commentRouter.get(
  "/summary",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
      const commentsAggregation = await Comment.aggregate([
        {
          $match: {
            articleId: {
              $in: (
                await Article.find({ author: userId })
              ).map((article) => article._id),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            comments: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const repliesAggregation = await Reply.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "parentComment",
            foreignField: "_id",
            as: "parentCommentDetails",
          },
        },
        {
          $unwind: "$parentCommentDetails",
        },
        {
          $match: {
            "parentCommentDetails.articleId": {
              $in: (
                await Article.find({ author: userId })
              ).map((article) => article._id),
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            replies: { $sum: 1 },
          },
        },
      ]);

      const totalComments =
        commentsAggregation.length > 0
          ? commentsAggregation
              .map((item) => item.comments)
              .reduce((a, b) => a + b)
          : 0;
      const totalReplies =
        repliesAggregation.length > 0
          ? repliesAggregation
              .map((item) => item.replies)
              .reduce((a, b) => a + b)
          : 0;

      const commentsSummary = commentsAggregation.map((item) => ({
        _id: item._id,
        comments: item.comments,
      }));

      const repliesSummary = repliesAggregation.map((item) => ({
        _id: item._id,
        replies: item.replies,
      }));

      res.json({
        totalComments,
        totalReplies,
        commentsSummary,
        repliesSummary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 * /comments/{articleId}:
 *   post:
 *     summary: Add a comment to an article by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to add a comment to an article by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: ID of the article to add a comment to.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "This is a new comment."
 *     responses:
 *       201:
 *         description: Successful request. Returns a success message and the added comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment added"
 *               comment: { commentObject }
 *       404:
 *         description: Article not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Article not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /comments/{articleId}:
 *   get:
 *     summary: Get comments for an article by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows fetching comments for an article by its ID.
 *     parameters:
 *       - name: articleId
 *         in: path
 *         description: ID of the article to get comments for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns comments for the specified article.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "commentId1"
 *                 content: "This is a comment."
 *                 author: { authorObject }
 *                 replies: [{ replyObject }]
 *                 createdAt: "2022-01-01T12:00:00.000Z"
 *               - _id: "commentId2"
 *                 content: "Another comment."
 *                 author: { authorObject }
 *                 replies: [{ replyObject }]
 *                 createdAt: "2022-01-02T14:30:00.000Z"
 *       404:
 *         description: Comments not found.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comments not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Edit a comment by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to edit their own comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of the comment to be edited.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "Edited content of the comment."
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the edited comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment edited"
 *               comment: { commentObject }
 *       403:
 *         description: Unauthorized to edit this comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized to edit this comment"
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

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to delete their own comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: commentId
 *         in: path
 *         description: ID of the comment to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment deleted"
 *       403:
 *         description: Unauthorized to delete this comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized to delete this comment"
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

/**
 * @swagger
 * /comments/like/{id}:
 *   post:
 *     summary: Like a comment by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to like a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to be liked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "userId123"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the liked comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "User liked the comment"
 *               comment: { commentObject }
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

/**
 * @swagger
 * /comments/dislike/{id}:
 *   post:
 *     summary: Dislike a comment by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to dislike a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to be disliked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "userId123"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the disliked comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "User disliked the comment"
 *               comment: { commentObject }
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

/**
 * @swagger
 * /comments/report/{id}:
 *   post:
 *     summary: Report a comment by ID.
 *     tags: [Comments]
 *     description: >
 *       This route allows an authenticated user to report a comment by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the comment to be reported.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "userId123"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the reported comment.
 *         content:
 *           application/json:
 *             example:
 *               message: "Comment reported"
 *               comment: { commentObject }
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
