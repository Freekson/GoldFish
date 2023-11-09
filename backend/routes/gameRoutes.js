import express from "express";
import expressAsyncHandler from "express-async-handler";
import Game from "../models/GameModel.js";

const gameRouter = express.Router();

gameRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const games = await Game.find();
    const gameCount = await Game.countDocuments();
    res.send({ games, gameCount });
  })
);

gameRouter.get(
  "/discounted",
  expressAsyncHandler(async (req, res) => {
    const discountedGames = await Game.find({
      discount: { $exists: true, $gt: 0 },
    });
    const discountedGameCount = await Game.countDocuments({
      discount: { $exists: true, $gt: 0 },
    });
    res.send({ discountedGames, discountedGameCount });
  })
);

//! dynamic routes must be in the end
gameRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const game = await Game.findById(req.params.id);
    if (game) {
      res.send(game);
    } else {
      res.status(404).send({ message: " Game not found" });
    }
  })
);

export default gameRouter;
