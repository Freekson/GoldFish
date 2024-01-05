import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { isAuth, isAuthor } from "../utils.js";
import Article from "../models/ArticleModel.js";
import User from "../models/UserModel.js";

const articleRouter = express.Router();

articleRouter.post(
  "/create",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const { title, content, tags, image } = req.body;
    const newArticle = new Article({
      title,
      content,
      author: req.user._id,
      image,
      tags,
    });
    const article = await newArticle.save();

    res.status(201).json(article);
  })
);

articleRouter.get(
  "/author-articles",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    try {
      const articles = await Article.find({ author: userId }).sort({
        createdAt: -1,
      });
      res.status(200).json(articles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

articleRouter.get(
  "/summary",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
      const summary = await Article.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalViews: { $sum: "$views" },
            totalLikes: { $sum: { $size: "$likedBy" } },
            totalDislikes: { $sum: { $size: "$dislikedBy" } },
            totalArticles: { $sum: 1 },
          },
        },
      ]);

      const dailyArticles = await Article.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            articles: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const tags = await Article.aggregate([
        { $match: { author: new mongoose.Types.ObjectId(userId) } },
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
      ]);
      const authorInfo = summary[0] || {
        totalViews: 0,
        totalLikes: 0,
        totalDislikes: 0,
        totalArticles: 0,
      };

      res.status(200).json({
        ...authorInfo,
        dailyArticles,
        tags,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  })
);

articleRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    const article = await Article.findById(id);

    if (article) {
      article.views += 1;
      await article.save();

      const author = await User.findById(article.author);

      if (author) {
        const articleWithAuthor = {
          ...article.toObject(),
          author: {
            _id: author._id,
            name: author.name,
            email: author.email,
            image: author.image,
          },
        };

        res.status(200).json(articleWithAuthor);
      } else {
        res.status(404).json({ message: "Author not found" });
      }
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  })
);

articleRouter.delete(
  "/:id",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      if (article.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this article" });
      }

      await Article.deleteOne({ _id: id });
      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  })
);

articleRouter.put(
  "/:id",
  isAuth,
  isAuthor,
  expressAsyncHandler(async (req, res) => {
    const id = req.params.id;
    const { title, content, tags, image } = req.body;

    try {
      const article = await Article.findById(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      if (article.author.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Unauthorized to update this article" });
      }

      article.title = title;
      article.content = content;
      article.tags = tags;
      article.image = image;

      const updatedArticle = await article.save();

      res.status(200).json(updatedArticle);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  })
);

articleRouter.post(
  "/like/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.id;
    const { userId } = req.body;

    const article = await Article.findById(articleId);

    if (article) {
      if (article.dislikedBy.includes(userId)) {
        article.dislikedBy.pull(userId);
      }

      if (!article.likedBy.includes(userId)) {
        article.likedBy.push(userId);
      }

      await article.save();
      res.status(200).json({ message: "User liked the article", article });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  })
);

articleRouter.post(
  "/dislike/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.id;
    const { userId } = req.body;

    const article = await Article.findById(articleId);

    if (article) {
      if (article.likedBy.includes(userId)) {
        article.likedBy.pull(userId);
      }
      if (!article.dislikedBy.includes(userId)) {
        article.dislikedBy.push(userId);
      }
      await article.save();
      res.status(200).json({ message: "User disliked the article", article });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  })
);

export default articleRouter;
