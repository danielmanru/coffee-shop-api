import cartService from "../services/cart-service.js";

const getUserCart = async(req, res, next) => {
  try {
    const result = await cartService.getUserCart(req.user._id);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const addItemToCart = async(req, res, next) => {
  try {
    const result = await cartService.addItemToCart(req);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const increaseQuantity = async(req, res, next) => {
  try {
    const result = await cartService.increaseQuantity(req.user._id, req.params.cartItemId);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const decreaseQuantity = async(req, res, next) => {
  try {
    const result = await cartService.increaseQuantity(req.user._id, req.params.cartItemId);
    return res.status(200).json({
      success: true,
      message: "Success!",
      data: result
    });
  } catch (error) {
    next(error)
  }
}

const deleteCartItem = async(req, res, next) => {
  try {
    const result = await cartService.deleteCartItem(req.user._id, req.params.cartItemId);
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
  getUserCart,
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem
}