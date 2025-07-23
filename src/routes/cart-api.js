import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import cartController from "../controllers/cart-controller.js";

const cartRouter = new express.Router();
cartRouter.get('/', authMiddleware(['user']), cartController.getUserCart)
cartRouter.post('/add', authMiddleware(['user']), cartController.addItemToCart)
cartRouter.patch('/increase/item/:cartItemId', authMiddleware(['user']), cartController.increaseQuantity)
cartRouter.patch('/decrease/item/:cartItemId', authMiddleware(['user']), cartController.decreaseQuantity)
cartRouter.delete('/delete/item/:cartItemId', authMiddleware(['user']), cartController.deleteCartItem)

export default cartRouter;