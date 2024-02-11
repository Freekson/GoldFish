import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { isAuth, isAuthor } from "../utils.js";
import Article from "../models/ArticleModel.js";
import User from "../models/UserModel.js";

const articleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: API for managing articles
 */

/**
 * @swagger
 * /api/article:
 *   get:
 *     summary: Get all articles.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching all articles.
 *     responses:
 *       200:
 *         description: Successful request. Returns a list of all articles (excluding content).
 *         content:
 *           application/json:
 *             example:
 *               articles: [{ articleObject }, { articleObject }]
 */

articleRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const articles = await Article.find({}, { content: 0 });
    res.json(articles);
  })
);

/**
 * @swagger
 * /api/article/filtered:
 *   get:
 *     summary: Get a filtered list of articles.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching a filtered list of articles based on various parameters.
 *     parameters:
 *       - name: authors
 *         in: query
 *         description: Authors of articles as an encoded array.
 *         schema:
 *           type: string
 *       - name: tags
 *         in: query
 *         description: Tags of articles as an encoded array.
 *         schema:
 *           type: string
 *       - name: search
 *         in: query
 *         description: String for searching by title, content, or tags of articles.
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: Sorting option for results (default is "newest").
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination (default is 1).
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful request. Returns a filtered list of articles.
 *         content:
 *           application/json:
 *             example:
 *               articles: [{ articleObject }, { articleObject }]
 *               totalArticles: 50
 *               totalPages: 5
 *               currentPage: 1
 *       400:
 *         description: Incorrect format of parameters. Returns an error message.
 *         content:
 *           application/json:
 *             example:
 *               message: "Incorrect format for arrays of authors, tags, search, or sort options"
 */

articleRouter.get(
  "/filtered",
  expressAsyncHandler(async (req, res) => {
    const encodedAuthors = req.query.authors;

    const encodedTags = req.query.tags;
    const searchQuery = req.query.search
      ? new RegExp(req.query.search, "i")
      : null;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 12;
    const sortOption = req.query.sort || "newest";

    try {
      let query = {};

      if (encodedAuthors) {
        const decodedAuthors = JSON.parse(decodeURIComponent(encodedAuthors));
        query.author = { $in: decodedAuthors };
      }

      if (encodedTags) {
        const decodedTags = JSON.parse(decodeURIComponent(encodedTags));
        query.tags = { $in: decodedTags };
      }

      if (searchQuery) {
        const searchCondition = {
          $or: [
            { title: searchQuery },
            { content: searchQuery },
            { tags: searchQuery },
          ],
        };

        if (Object.keys(query).length > 0) {
          query = { $and: [query, searchCondition] };
        } else {
          query = searchCondition;
        }
      }

      let sortOptionQuery = {};
      switch (sortOption) {
        case "newest":
          sortOptionQuery = { createdAt: -1 };
          break;
        case "oldest":
          sortOptionQuery = { createdAt: 1 };
          break;
        case "highest-rated":
          sortOptionQuery = { rating: -1 };
          break;
        case "lowest-rated":
          sortOptionQuery = { rating: 1 };
          break;
        default:
          sortOptionQuery = { createdAt: -1 };
      }

      const totalArticlesCount = await Article.countDocuments(query);

      const articlesWithFilters = await Article.find(query)
        .sort(sortOptionQuery)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      res.send({
        articles: articlesWithFilters,
        totalArticles: totalArticlesCount,
        totalPages: Math.ceil(totalArticlesCount / pageSize),
        currentPage: page,
      });
    } catch (error) {
      res.status(400).send({
        message:
          "Incorrect format for arrays of authors, tags, search, or sort options",
      });
    }
  })
);

/**
 * @swagger
 * /api/article/create:
 *   post:
 *     summary: Create a new article.
 *     tags: [Articles]
 *     description: >
 *       This route allows authenticated authors to create a new article.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Article successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized. Please log in."
 *       403:
 *         description: Forbidden. User does not have permission to access.
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden. Insufficient permissions."
 *       400:
 *         description: Bad request. Missing required fields or invalid data format.
 *         content:
 *           application/json:
 *             example:
 *               message: "Bad request. Missing required fields or invalid data format."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/article/author-articles:
 *   get:
 *     summary: Get articles authored by the authenticated author.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching articles authored by the authenticated author.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful request. Returns articles authored by the author.
 *         content:
 *           application/json:
 *             example:
 *               articles: [{ articleObject }, { articleObject }]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized. Please log in."
 *       403:
 *         description: Forbidden. User does not have permission to access.
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden. Insufficient permissions."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/article/summary:
 *   get:
 *     summary: Get summary statistics for the authenticated author.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching summary statistics for the authenticated author, including total views, likes, dislikes, total articles, daily articles count, and tag statistics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful request. Returns summary statistics for the author.
 *         content:
 *           application/json:
 *             example:
 *               totalViews: 1000
 *               totalLikes: 500
 *               totalDislikes: 50
 *               totalArticles: 20
 *               dailyArticles: [{ date: "2022-01-01", articles: 5 }, { date: "2022-01-02", articles: 8 }]
 *               tags: [{ tag: "tag1", count: 10 }, { tag: "tag2", count: 5 }]
 *       401:
 *         description: Unauthorized. User not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized. Please log in."
 *       403:
 *         description: Forbidden. User does not have permission to access.
 *         content:
 *           application/json:
 *             example:
 *               message: "Forbidden. Insufficient permissions."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

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

/**
 * @swagger
 * /api/article/tags-count:
 *   get:
 *     summary: Get count of all tags used in articles.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching the count of all tags used in articles.
 *     responses:
 *       200:
 *         description: Successful request. Returns count of all tags used in articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Tag name.
 *                   count:
 *                     type: integer
 *                     description: Number of articles using this tag.
 *       404:
 *         description: Tags not found. No tags are available.
 *         content:
 *           application/json:
 *             example:
 *               message: "Tags not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

articleRouter.get(
  "/tags-count",
  expressAsyncHandler(async (req, res) => {
    try {
      const tagsCount = await Article.aggregate([
        { $unwind: "$tags" },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
      ]);

      if (tagsCount && tagsCount.length > 0) {
        res.send(tagsCount);
      } else {
        res.status(404).send({ message: "Tags not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 * /api/article/authors-count:
 *   get:
 *     summary: Get count of articles for each author.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching the count of articles for each author.
 *     responses:
 *       200:
 *         description: Successful request. Returns count of articles for each author.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the author.
 *                   name:
 *                     type: string
 *                     description: Name of the author.
 *                   count:
 *                     type: integer
 *                     description: Number of articles written by this author.
 *       404:
 *         description: Authors not found. No authors with articles are available.
 *         content:
 *           application/json:
 *             example:
 *               message: "Authors not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

articleRouter.get(
  "/authors-count",
  expressAsyncHandler(async (req, res) => {
    try {
      const authorsArticlesCount = await User.aggregate([
        {
          $lookup: {
            from: "articles",
            localField: "_id",
            foreignField: "author",
            as: "articles",
          },
        },
        {
          $project: {
            _id: "$_id",
            name: "$name",
            count: { $size: "$articles" },
          },
        },
        {
          $match: {
            count: { $gt: 0 },
          },
        },
        { $sort: { count: -1, _id: 1 } },
      ]);

      if (authorsArticlesCount && authorsArticlesCount.length > 0) {
        res.send(authorsArticlesCount);
      } else {
        res.status(404).send({ message: "Authors not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 * /api/article/latest-articles:
 *   get:
 *     summary: Get the three latest articles.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching the three latest articles.
 *     responses:
 *       200:
 *         description: Successful request. Returns the three latest articles.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal Server Error"
 */

articleRouter.get(
  "/latest-articles",
  expressAsyncHandler(async (req, res) => {
    try {
      const latestArticles = await Article.find()
        .sort({ createdAt: -1 })
        .limit(3);
      res.status(200).json(latestArticles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);

//! dynamic routes

/**
 * @swagger
 * /api/article/{id}:
 *   get:
 *     summary: Get an article by ID.
 *     tags: [Articles]
 *     description: >
 *       This route allows fetching an article by its ID, updating the views count, and including author information.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns the article with author information.
 *         content:
 *           application/json:
 *             example:
 *               _id: "articleId"
 *               title: "Example Article"
 *               content: "This is an example article."
 *               image: "example.jpg"
 *               tags: ["tag1", "tag2"]
 *               author: { _id: "authorId", name: "Author Name", email: "author@example.com", image: "author.jpg" }
 *       404:
 *         description: Article or author not found.
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

/**
 * @swagger
 * /api/article/{id}:
 *   delete:
 *     summary: Delete an article by ID.
 *     tags: [Articles]
 *     description: >
 *       This route allows an authenticated author to delete their own article by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message.
 *         content:
 *           application/json:
 *             example:
 *               message: "Article deleted successfully"
 *       403:
 *         description: Unauthorized. User does not have permission to delete the article.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized to delete this article"
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

/**
 * @swagger
 * /api/article/{id}:
 *   put:
 *     summary: Update an article by ID.
 *     tags: [Articles]
 *     description: >
 *       This route allows an authenticated author to update their own article by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article to be updated.
 *         required: true
 *         schema:
 *           type: string
 *       - name: title
 *         in: formData
 *         description: Updated title of the article.
 *         required: true
 *         schema:
 *           type: string
 *       - name: content
 *         in: formData
 *         description: Updated content of the article.
 *         required: true
 *         schema:
 *           type: string
 *       - name: tags
 *         in: formData
 *         description: Updated tags of the article as an array.
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - name: image
 *         in: formData
 *         description: Updated image URL of the article.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful request. Returns the updated article.
 *         content:
 *           application/json:
 *             example:
 *               _id: "articleId"
 *               title: "Updated Article"
 *               content: "This is an updated article."
 *               image: "updated.jpg"
 *               tags: ["tag1", "tag2"]
 *       403:
 *         description: Unauthorized. User does not have permission to update the article.
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized to update this article"
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

/**
 * @swagger
 * /api/article/like/{id}:
 *   post:
 *     summary: Like an article by ID.
 *     tags: [Articles]
 *     description: >
 *       This route allows an authenticated user to like an article by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article to be liked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "userId"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the updated article.
 *         content:
 *           application/json:
 *             example:
 *               message: "User liked the article"
 *               article: { articleObject }
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

/**
 * @swagger
 * /api/article/dislike/{id}:
 *   post:
 *     summary: Dislike an article by ID.
 *     tags: [Articles]
 *     description: >
 *       This route allows an authenticated user to dislike an article by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the article to be disliked.
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "userId"
 *     responses:
 *       200:
 *         description: Successful request. Returns a success message and the updated article.
 *         content:
 *           application/json:
 *             example:
 *               message: "User disliked the article"
 *               article: { articleObject }
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
