import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import orderController from "../controllers/order-controller.js";

const orderRouter = new express.Router();

orderRouter.get("/", authMiddleware(['customer']), orderController.getUserOrder);
orderRouter.get("/order/:orderId", authMiddleware(['customer', 'admin']), orderController.getOrderById);
orderRouter.post("/add", authMiddleware(['customer']), orderController.createOrder);
orderRouter.patch("/update/status", authMiddleware(), orderController.updateOrderStatus);

export default orderRouter;
