import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import gameRouter from "./routes/gameRoutes.js";

//fetch variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err.message));

app.use("/api/games", gameRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
