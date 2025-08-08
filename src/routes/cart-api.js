import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import cartController from "../controllers/cart-controller.js";

const cartRouter = new express.Router();
cartRouter.get('/user', authMiddleware(['customer']), cartController.getUserCart)
cartRouter.post('/add', authMiddleware(['customer']), cartController.addItemToCart)
cartRouter.patch('/increase/item/:cartItemId', authMiddleware(['customer']), cartController.increaseQuantity)
cartRouter.patch('/decrease/item/:cartItemId', authMiddleware(['customer']), cartController.decreaseQuantity)
cartRouter.delete('/delete/item/:cartItemId', authMiddleware(['customer']), cartController.deleteCartItem)

export default cartRouter;