import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware())
userRouter.get('/api/users', userController.get)
userRouter.get('/api/users/sendVerificationEmail', userController.sendVerificationEmail)
userRouter.get('/api/users/verifyUser', userController.verifyUser)
userRouter.get('/api/users/refreshToken', authMiddleware( { tokenType: "refresh" } ), userController.refreshToken)
userRouter.post('/api/users/resetPassword', userController.resetPassword)
userRouter.put('/api/users/updateUserDetail', userController.update)
userRouter.post('/api/users/changePassword', userController.changePassword)
userRouter.put('/api/users/current/logout', userController.logout)

export{
  userRouter
}