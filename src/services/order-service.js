import Order from "../models/order.model.js";
import {ResponseError} from "../error/response-error.js";
import Menu from "../models/menu.model.js";

const getUserOrder = async (user_id) => {
  const userOrders = await Order.find({userId: user_id});
  if (!userOrders.length) {
    throw new ResponseError(404, "User not order yet");
  }

  return userOrders;
}

const getOrderById = async (order_id) => {
  const order = await Order.findById(order_id);
  if (!order) {
    throw new ResponseError(404, "Order not found");
  }

  return order;
}

const createOrder = async (request) => {
  const req = request.body;
  if ((req.orderType === 'pick-up' || req.orderType === 'dine-in') &&
    req.deliveryFee > 0
  ) {
    throw new ResponseError(400, `'deliveryFee' must be 0 for '${req.orderType}' orders, but got ${req.deliveryFee}`);
  }
  if (req.orderType === 'delivery' && req.deliveryFee <= 0) {
    throw new ResponseError(400, `'deliveryFee' must be more than 0 for 'delivery' orders`);
  }
  req.userId = request.user._id
  req.items = await Promise.all(
    req.items.map(async (item) => {
      const menu = await Menu.findById(item.menuId);
      if (!menu) {
        throw new ResponseError(404, "Menu not found");
      }

      const menuPrice = menu.variants.find(variant => variant.size === item.variant)?.price;

      return {
        ...item,
        price: menuPrice
      };
    })
  )
  const order = new Order(req);
  order.totalPrice = order.calculateTotalPrice();
  order.status = "pending";

  return order.save();
}

const updateOrderStatus = async (order_id, order_status) => {
  const order = await Order.findByIdAndUpdate(
    order_id,
    {status: order_status},
    {
      runValidators: true,
      new: true
    }
  )
}

export default {
  getOrderById,
  getUserOrder,
  createOrder,
  updateOrderStatus
}