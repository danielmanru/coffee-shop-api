import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import paymentController from "../controllers/payment-controller.js";

const paymentRouter = new express.Router();

paymentRouter.post('/add', authMiddleware(['customer']), paymentController.addPayment)
paymentRouter.patch('/update/status', authMiddleware(['customer', 'admin']), paymentController.updatePaymentStatus);

export default paymentRouter;