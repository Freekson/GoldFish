import express from "express";
import expressAsyncHandler from "express-async-handler";
import Game from "../models/GameModel.js";

const gameRouter = express.Router();

gameRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const games = await Game.find();
    if (games) {
      const gameCount = await Game.countDocuments();
      res.send({ games, gameCount });
    } else {
      res.status(404).send({ message: "Games not found" });
    }
  })
);

gameRouter.get(
  "/discounted",
  expressAsyncHandler(async (req, res) => {
    const discountedGames = await Game.find({
      discount: { $exists: true, $gt: 0 },
    });
    if (discountedGames) {
      const discountedGameCount = await Game.countDocuments({
        discount: { $exists: true, $gt: 0 },
      });
      res.send({ discountedGames, discountedGameCount });
    } else {
      res.status(404).send({ message: "Games not found" });
    }
  })
);

gameRouter.get(
  "/combined-top",
  expressAsyncHandler(async (req, res) => {
    const combinedTopGames = await Game.aggregate([
      {
        $facet: {
          topRated: [{ $sort: { average_rating: -1 } }, { $limit: 4 }],
          topDiscounted: [
            { $match: { discount: { $exists: true, $gt: 0 } } },
            { $sort: { discount: -1 } },
            { $limit: 4 },
          ],
        },
      },
      {
        $project: {
          combined: {
            $concatArrays: ["$topRated", "$topDiscounted"],
          },
        },
      },
    ]);

    if (combinedTopGames) {
      res.send(combinedTopGames[0].combined);
    } else {
      res.status(404).send({ message: "Games not found" });
    }
  })
);

//! dynamic routes

gameRouter.get(
  "/product-page-combined/:id",
  expressAsyncHandler(async (req, res) => {
    const gameId = req.params.id;
    const gameById = await Game.findById(gameId);

    if (!gameById) {
      return res.status(404).send({ message: "Game not found" });
    }

    const category = gameById.category;
    const gamesInCategory = await Game.find({
      category: category,
      _id: { $ne: gameId },
    }).limit(4);

    const combinedArray = [gameById, ...gamesInCategory];

    res.send(combinedArray);
  })
);

gameRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);
    if (game) {
      res.send(game);
    } else {
      res.status(404).send({ message: "Game not found" });
    }
  })
);

export default gameRouter;
