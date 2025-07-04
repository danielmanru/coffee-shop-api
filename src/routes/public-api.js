import express from "express";
import userController from "../controllers/user-controller.js";

const publicRouter = new express.Router();
publicRouter.post('/forgetPassword', userController.forgetPassword)
publicRouter.post('/register', userController.register)
publicRouter.post('/login', userController.login)

export default publicRouter;