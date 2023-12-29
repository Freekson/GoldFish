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
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const articleId = req.params.id;

    const article = await Article.findById(articleId);

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
          },
        };

        res.status(200).json(articleWithAuthor);
      } else {
        res.status(404).json({ message: "Author nor found" });
      }
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  })
);

export default articleRouter;
