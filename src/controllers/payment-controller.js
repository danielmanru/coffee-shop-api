import paymentService from "../services/payment-service.js";

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
  updatePaymentStatus
}