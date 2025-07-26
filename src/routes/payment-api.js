import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import paymentController from "../controllers/payment-controller.js";

const paymentRouter = new express.Router();

paymentRouter.get('/', authMiddleware(['admin']), paymentController.getAllPayments);
paymentRouter.get('/order/:orderId', authMiddleware(['admin']), paymentController.getPaymentByOrderId);
paymentRouter.post('/add', authMiddleware(['customer']), paymentController.addPayment)
paymentRouter.patch('/update/status', authMiddleware(['customer', 'admin']), paymentController.updatePaymentStatus);

export default paymentRouter;