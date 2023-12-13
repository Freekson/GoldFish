import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import gameRouter from "./routes/gameRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoute.js";
import promoCodeRouter from "./routes/promoCodeRoutes.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

//fetch variables from .env file
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err.message));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generating Swagger specification
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GoldFish API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

// Connecting Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route for getting JSON-file Swagger-specification
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.use("/api/games", gameRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/promocodes", promoCodeRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
