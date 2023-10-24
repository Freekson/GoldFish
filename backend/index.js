import express from "express";
import dotenv from "dotenv";

//fetch variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});
