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

gameRouter.get(
  "/ratings-count",
  expressAsyncHandler(async (req, res) => {
    try {
      const ratingsCount = await Game.aggregate([
        {
          $group: {
            _id: { $floor: "$average_rating" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      res.send(ratingsCount);
    } catch (error) {
      res.status(500).send({
        message: "Error while fetching ratings count",
        error: error.message,
      });
    }
  })
);

//! dynamic routes

gameRouter.get(
  "/filtered",
  expressAsyncHandler(async (req, res) => {
    const encodedCategories = req.query.categories;
    const encodedPublishers = req.query.publishers;
    const encodedRatings = req.query.ratings;
    const isDiscounted = req.query.discounted === "true";
    const minPrice = parseFloat(req.query.min);
    const maxPrice = parseFloat(req.query.max);
    const page = parseInt(req.query.page) || 1;
    const pageSize = 9;
    const sortOption = req.query.sort || "newest";
    const searchQuery = req.query.search
      ? new RegExp(req.query.search, "i")
      : null;

    try {
      let query = {};

      if (encodedCategories) {
        const decodedCategories = JSON.parse(
          decodeURIComponent(encodedCategories)
        );
        query.category = { $in: decodedCategories };
      }

      if (encodedPublishers) {
        const decodedPublishers = JSON.parse(
          decodeURIComponent(encodedPublishers)
        );
        query.publisher = { $in: decodedPublishers };
      }

      if (encodedRatings) {
        const decodedRatings = JSON.parse(decodeURIComponent(encodedRatings));
        query.$or = decodedRatings.map((rating) => ({
          average_rating: { $gte: rating, $lt: rating + 1 },
        }));
      }

      if (isDiscounted) {
        query.discount = { $exists: true, $gt: 0 };
      }

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        query.price = { $gte: minPrice, $lte: maxPrice };
      }

      if (searchQuery) {
        query.$or = [{ title: searchQuery }, { description: searchQuery }];
      }

      let sortOptionQuery = {};
      switch (sortOption) {
        case "newest":
          sortOptionQuery = { release_year: -1 };
          break;
        case "oldest":
          sortOptionQuery = { release_year: 1 };
          break;
        case "lowest":
          sortOptionQuery = { price: 1 };
          break;
        case "highest":
          sortOptionQuery = { price: -1 };
          break;
        case "toprated":
          sortOptionQuery = { average_rating: -1 };
          break;
        case "lessrated":
          sortOptionQuery = { average_rating: 1 };
          break;
        default:
          sortOptionQuery = { release_year: -1 };
      }

      const totalGamesCount = await Game.countDocuments(query);

      const gamesWithFilters = await Game.find(query)
        .sort(sortOptionQuery)
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      res.send({
        games: gamesWithFilters,
        totalGames: totalGamesCount,
        totalPages: Math.max(Math.ceil(totalGamesCount / pageSize), 1),
        currentPage: page,
      });
    } catch (error) {
      res.status(400).send({
        message:
          "Incorrect format for arrays of categories, publishers, ratings, discounted, price or sort options",
      });
    }
  })
);

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
