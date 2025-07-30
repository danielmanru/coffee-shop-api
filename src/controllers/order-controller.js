import orderService from "../services/order-service.js";

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders();
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    })
  } catch (error) {
    next(error)
  }
}

const getUserOrders = async ( req, res, next ) => {
  try {
    const result = await orderService.getUserOrders(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getOrdersByUserId = async ( req, res, next ) => {
  try {
    const result = await orderService.getUserOrders(req.params.userId);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const getOrdersByOutletId = async ( req, res, next ) => {
  try {
    const result = await orderService.getOrdersByOutletId(req.params.outletId);
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
    return res.status(201).json({
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
  getAllOrders,
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getOrdersByUserId,
  getOrdersByOutletId
}