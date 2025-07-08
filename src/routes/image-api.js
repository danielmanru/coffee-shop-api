import express from "express";
import imageController from "../controllers/image-controller.js";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js";

const imageRouter = new express.Router();
imageRouter.post('/addImage/for/:modelName', authMiddleware(["admin"]), upload.array("images", 10), imageController.addImages);
imageRouter.put('/deleteImage/for/:modelName', authMiddleware(["admin"]), imageController.deleteImages);

export default imageRouter;
