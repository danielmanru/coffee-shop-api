import express from "express";
import imageController from "../controllers/image-controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js";

const imageRouter = new express.Router();
imageRouter.post('/addImage', authMiddleware(["admin"]), upload.array("images", 10), imageController.addImage);
imageRouter.put('/deleteImage', authMiddleware(["admin"]), imageController.deleteImage);

export default imageRouter;
