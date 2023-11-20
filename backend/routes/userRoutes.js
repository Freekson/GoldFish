import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          experience: user.experience,
          isAdmin: user.isAdmin,
          isAuthor: user.isAuthor,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res
        .status(400)
        .send({ message: "A user with this email is already exist" });
      return;
    }

    const newUser = new User({
      name,
      email,
      password: bcrypt.hashSync(password),
    });

    try {
      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        experience: user.experience,
        isAdmin: user.isAdmin,
        isAuthor: user.isAuthor,
        token: generateToken(user),
      });
    } catch (error) {
      res
        .status(500)
        .send({ message: "An error occurred while registering the user" });
    }
  })
);

export default userRouter;
