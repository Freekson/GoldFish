import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Log in a user with valid credentials.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful login with user details and token.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               experience: 100
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       401:
 *         description: Invalid email or password.
 *         content:
 *           application/json:
 *             example:
 *               message: Invalid email or password
 */

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

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successful registration with user details and token.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               experience: 0
 *               isAdmin: false
 *               isAuthor: false
 *               token: "jwt_token"
 *       400:
 *         description: A user with this email already exists.
 *         content:
 *           application/json:
 *             example:
 *               message: A user with this email is already exist
 *       500:
 *         description: An error occurred while registering the user.
 *         content:
 *           application/json:
 *             example:
 *               message: An error occurred while registering the user
 */

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
        token: user.token,
      });
      return;
    } catch (error) {
      res
        .status(500)
        .send({ message: "An error occurred while registering the user" });
    }
  })
);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user.
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful response with user details and token.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               experience: 100
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.get(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        experience: user.experience,
        isAdmin: user.isAdmin,
        isAuthor: user.isAuthor,
        token: generateToken(user),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

/**
 * @swagger
 * /api/users/update-experience:
 *   put:
 *     summary: Update user experience
 *     description: Update the experience of the authenticated user.
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: Successful response with updated user details.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               experience: 150
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.put(
  "/update-experience",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { experienceToAdd } = req.body;

    const user = await User.findById(userId);

    if (user) {
      user.experience += experienceToAdd;
      const updatedUser = await user.save();

      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

/**
 * @swagger
 * /api/users/update-password:
 *   put:
 *     summary: Update user password
 *     description: Update the password of the authenticated user.
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Current password of the user.
 *               newPassword:
 *                 type: string
 *                 description: New password for the user.
 *     responses:
 *       200:
 *         description: Successful response with updated user details.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "John Doe"
 *               email: "john@example.com"
 *               experience: 150
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       401:
 *         description: Incorrect current password.
 *         content:
 *           application/json:
 *             example:
 *               message: Incorrect current password
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.put(
  "/update-password",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (user) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (isPasswordValid) {
        const hashedNewPassword = await bcrypt.hashSync(newPassword);
        user.password = hashedNewPassword;
        const updatedUser = await user.save();
        res.send(updatedUser);
      } else {
        res.status(401).send({ message: "Incorrect current password" });
      }
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

/**
 * @swagger
 * /api/users/update-name:
 *   put:
 *     summary: Update user name
 *     description: Update the name of the authenticated user.
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: New name for the user.
 *     responses:
 *       200:
 *         description: Successful response with updated user details.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "New Name"
 *               email: "user@example.com"
 *               experience: 100
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       401:
 *         description: Unauthorized, user not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */

userRouter.put(
  "/update-name",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { newName } = req.body;

    const user = await User.findById(userId);

    if (user) {
      user.name = newName;
      const updatedUser = await user.save();
      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

/**
 * @swagger
 * /api/users/update-email:
 *   put:
 *     summary: Update user email
 *     description: Update the email of the authenticated user and check for duplicate emails in the database.
 *     tags: [User]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *                 description: New email for the user.
 *     responses:
 *       200:
 *         description: Successful response with updated user details.
 *         content:
 *           application/json:
 *             example:
 *               _id: "1234567890"
 *               name: "User Name"
 *               email: "new.email@example.com"
 *               experience: 100
 *               isAdmin: false
 *               isAuthor: true
 *               token: "jwt_token"
 *       400:
 *         description: Email already in use or bad request.
 *         content:
 *           application/json:
 *             example:
 *               message: Email already in use
 *       401:
 *         description: Unauthorized, user not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

userRouter.put(
  "/update-email",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { newEmail } = req.body;

    try {
      const existingUser = await User.findOne({ email: newEmail });

      if (existingUser) {
        return res.status(400).send({ message: "Email already in use" });
      }

      const user = await User.findById(userId);

      if (user) {
        user.email = newEmail;
        const updatedUser = await user.save();

        res.send(updatedUser);
      } else {
        res.status(404).send({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error updating email:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  })
);

export default userRouter;
