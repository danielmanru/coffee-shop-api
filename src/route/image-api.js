import express from "express";
import imageController from "../controller/image-controller.js";
import {authMiddleware} from "../middleware/auth-middleware.js";
import upload from "../middleware/multer-middleware.js";

const imageRouter = new express.Router();
imageRouter.post('/api/images/addImage', authMiddleware(["admin"]), upload.array("images", 10), imageController.addImage);
imageRouter.put('/api/images/deleteImage', authMiddleware(["admin"]), imageController.deleteImage);

export default imageRouter;
