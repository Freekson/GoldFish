import express from "express";
import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { isAuth } from "../utils.js";
import Wishlist from "../models/WishListModel.js";

const wishListRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: WishList
 *   description: Wishlist operations
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     description: Retrieve the user's wishlist.
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with an array of games in the wishlist.
 *         content:
 *           application/json:
 *             example:
 *               - _id: "1234567890"
 *                 title: "Game 1"
 *                 description: "Description for Game 1"
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             example:
 *               message: User ID is required in the request body.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */

wishListRouter.get(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.query.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is required in the request body." });
    }

    const wishlist = await Wishlist.findOne({ user: userId }).populate("games");

    if (wishlist) {
      res.json(wishlist.games);
    } else {
      res.json([]);
    }
  })
);

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add a game to the wishlist
 *     description: Add a game to the user's wishlist.
 *     tags: [WishList]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             userId: "1234567890"
 *             gameId: "0987654321"
 *     responses:
 *       200:
 *         description: Successful response with a message.
 *         content:
 *           application/json:
 *             example:
 *               message: Game added to wishlist successfully.
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             example:
 *               message: User ID and Game ID are required in the request body.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       409:
 *         description: Conflict.
 *         content:
 *           application/json:
 *             example:
 *               message: Game is already in the wishlist.
 */

wishListRouter.post(
  "/add",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, gameId } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({
        message: "User ID and Game ID are required in the request body.",
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, games: [] });
    }

    const gameIdObject = new mongoose.Types.ObjectId(gameId);

    if (wishlist.games.includes(gameIdObject)) {
      return res
        .status(400)
        .json({ message: "Game is already in the wishlist." });
    }

    wishlist.games.push(gameIdObject);
    await wishlist.save();

    res.send({ wishlist, message: "Game added to wishlist successfully." });
  })
);

/**
 * @swagger
 * /api/wishlist/remove:
 *   delete:
 *     summary: Remove a game from the user's wishlist
 *     description: Remove a specific game from the user's wishlist.
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID.
 *               gameId:
 *                 type: string
 *                 description: Game ID.
 *             required:
 *               - userId
 *               - gameId
 *     responses:
 *       200:
 *         description: Successful response with updated wishlist and a message.
 *         content:
 *           application/json:
 *             example:
 *               wishlist:
 *                 user: "user_id"
 *                 games: ["game_id_1", "game_id_2"]
 *               message: "Game removed from wishlist successfully."
 *       400:
 *         description: Bad Request.
 *         content:
 *           application/json:
 *             examples:
 *               - value:
 *                   message: User ID and Game ID are required in the request body.
 *               - value:
 *                   message: "Game is not in the wishlist."
 *       404:
 *         description: Wishlist not found for the user.
 *         content:
 *           application/json:
 *             example:
 *               message: Wishlist not found for the user.
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */

wishListRouter.delete(
  "/remove",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { userId, gameId } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({
        message: "User ID and Game ID are required in the request body.",
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res
        .status(404)
        .json({ message: "Wishlist not found for the user." });
    }

    const gameIdObject = new mongoose.Types.ObjectId(gameId);

    if (!wishlist.games.includes(gameIdObject)) {
      return res.status(400).json({ message: "Game is not in the wishlist." });
    }

    wishlist.games = wishlist.games.filter((id) => !id.equals(gameIdObject));
    await wishlist.save();

    res.json({ wishlist, message: "Game removed from wishlist successfully." });
  })
);
export default wishListRouter;
