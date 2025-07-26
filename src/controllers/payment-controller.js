import paymentService from "../services/payment-service.js";

const getAllPayments = async (req, res, next) => {
  try {
    const result = await paymentService.getAllPayments();
    return res.status(200).json({
      success: true,
      message: 'Success!',
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getPaymentByOrderId = async (req, res, next) => {
  try {
    const result = await paymentService.getPaymentByOrderId(req.params.orderId);
    return res.status(200).json({
      success: true,
      message: 'Success!',
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const addPayment = async (req, res, next) => {
  try {
    const result = await paymentService.addPayment(req);
    return res.status(201).json({
      success: true,
      message: 'Success!',
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const updatePaymentStatus = async (req, res, next) => {
  try {
    await paymentService.updatePaymentStatus(req);
    return res.status(200).json({
      success: true,
      message: `Success!`,
      data: null
    });
  } catch (error) {
    next(error)
  }
}

export default {
  addPayment,
  updatePaymentStatus,
  getAllPayments,
  getPaymentByOrderId
}