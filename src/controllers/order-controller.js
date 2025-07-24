import orderService from "../services/order-service.js";

const getUserOrder = async ( req, res, next ) => {
  try {
    const result = await orderService.getUserOrder(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getOrderById = async ( req, res, next ) => {
  try {
    const result = await orderService.getOrderById(req.params.orderId);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const createOrder = async ( req, res, next ) => {
  try {
    const result = await orderService.createOrder(req);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const updateOrderStatus = async ( req, res, next ) => {
  try {
    const result = await orderService.updateOrderStatus(req.query.orderId, req.query.orderStatus);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

export default {
  getUserOrder,
  getOrderById,
  createOrder,
  updateOrderStatus
}