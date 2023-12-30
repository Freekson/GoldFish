import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { isAuth } from "../utils.js";

const upload = multer();

const uploadRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: API for uploading files
 */

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Update user profile image
 *     description: Update the profile image of the authenticated user using Cloudinary.
 *     tags: [Upload]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be uploaded.
 *     responses:
 *       200:
 *         description: Successful response with Cloudinary details.
 *         content:
 *           application/json:
 *             example:
 *               public_id: "sample_public_id"
 *               version: 1234567890
 *               signature: "sample_signature"
 *               width: 1000
 *               height: 800
 *               format: "jpg"
 *               resource_type: "image"
 *               url: "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/sample.jpg"
 *       401:
 *         description: Unauthorized, user not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

uploadRouter.post("/image", isAuth, upload.single("file"), async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    res.send(result);
  } catch (error) {
    console.error("Error in image upload:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default uploadRouter;
