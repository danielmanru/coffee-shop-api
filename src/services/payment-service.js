import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import {ResponseError} from "../error/response-error.js";
import Outlet from "../models/outlet.model.js";

const getAllPayments = async () => {
  return Payment.find({});
}

const getPaymentByOrderId = async (user, order_id) => {
  const payment = await Payment.findOne({orderId: order_id})
  if(!payment) {
    throw new ResponseError(404, "Payment not found");
  }
  if(user.role === "customer") {
    if(user._id !== payment.userId) {
      throw new ResponseError(401, "Unauthorized");
    }
  } else if(user.role === "staff") {
    const staffOutletId = await Outlet.find({"staff.staffId" : user._id}).select("_id");
    const orderOutletId = await Order.find({_id: payment.orderId}).select("outletId");
    if (staffOutletId !== orderOutletId) {
      throw new ResponseError(401, "Unauthorized");
    }
  }

  return payment;
}

const addPayment = async (request) => {
  const req = request.body;
  req.userId = request.user._id;
  const paymentRequest = new Payment(req);
  const error = await paymentRequest.validateSync(['orderId']);
  if (error) {
    throw new ResponseError(400, "orderId is invalid");
  }

  if (await Payment.countDocuments({orderId: paymentRequest.orderId})) {
    throw new ResponseError(409, "Payment is already created")
  }

  const order = await Order.findById(paymentRequest.orderId);
  if (!order) {
    throw new ResponseError(404, 'Order not found');
  }
  //assuming backend receive response from payment gateway
  Object.assign(paymentRequest, {
    paymentUrl: "https://www.paymentgateway.com/payment/example",
    expiresAt: new Date(Date.now() + 3 * 60 * 60 * 1000)
  });

  return paymentRequest.save();
}

const updatePaymentStatus = async (request) => {
  if (typeof request.query.orderId !== "string") {
    throw new ResponseError(400, 'orderId is invalid');
  }

  if (request.user.role === "admin" && request.query.paymentStatus === 'paid') {
    if (!request.body) {
      throw new ResponseError(400, 'Payment receipt is required');
    }

    const payment = await Payment.findOne({ orderId: request.query.orderId });

    if (!payment) {
      throw new ResponseError(404, 'Payment not found');
    }

    payment.paymentReceipt = request.body;
    await payment.save();
  }

  const payment = await getPaymentByOrderId(request.query.orderId);
  if (payment.status !== 'unpaid') {
    throw new ResponseError(409, 'Payment status already updated');
  }
  payment.status = request.query.paymentStatus;
  await payment.save();

  return null
}

export default {
  addPayment,
  updatePaymentStatus,
  getAllPayments,
  getPaymentByOrderId
}