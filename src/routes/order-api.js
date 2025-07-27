import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import orderController from "../controllers/order-controller.js";

const orderRouter = new express.Router();

orderRouter.get("/user/orders", authMiddleware(['customer']), orderController.getUserOrders);
orderRouter.get("/", authMiddleware(['admin']), orderController.getAllOrders);
orderRouter.get("/order/:orderId", authMiddleware(['customer', 'admin']), orderController.getOrderById);
orderRouter.get("/user/:userId", authMiddleware(['admin']), orderController.getOrdersByUserId);
orderRouter.get("/outlet/:outletId", authMiddleware(['admin']), orderController.getOrdersByOutletId);
orderRouter.post("/add", authMiddleware(['customer']), orderController.createOrder);
orderRouter.patch("/update/status", authMiddleware(), orderController.updateOrderStatus);

export default orderRouter;
