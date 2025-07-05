import express from "express";
import userController from "../controllers/user-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware())
userRouter.get('/user', userController.getUser)
userRouter.get('/sendVerificationEmail', userController.sendVerificationEmail)
userRouter.get('/verifyUser', userController.verifyUser)
userRouter.get('/refreshToken', userController.refreshToken)
userRouter.put('/resetPassword', userController.resetPassword)
userRouter.put('/updateUserDetail', userController.updateUserDetail)
userRouter.put('/changePassword', userController.changePassword)
userRouter.put('/logout', userController.logout)

export default  userRouter;