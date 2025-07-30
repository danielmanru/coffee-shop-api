import Cart from "../models/cart.model.js";
import {ResponseError} from "../error/response-error.js";
import Menu from "../models/menu.model.js";

const initializeNewCart = async (user_id) => {
  await Cart.create({userId: user_id});
}

const getUserCart = async (user_id) => {
  const userCart = await Cart.findOne({userId: user_id});

  if (!userCart) {
    throw new ResponseError(404,"Cart not found");
  }

  return userCart;
}

const addItemToCart = async (request) => {
  let userCart = await getUserCart(request.user._id);

  const existingCartItem = await userCart.items.find(item =>
    item.menuId.equals(request.body.menuId) &&
    item.temperature === request.body.temperature &&
    item.iceLevel === request.body.iceLevel &&
    item.variant === request.body.variant
  );

  if (existingCartItem) {
    existingCartItem.quantity += 1;
  } else {
    const menu = await Menu.findById(request.body.menuId)
    if(!menu) {
      throw new ResponseError(404, "Menu not found");
    }

    const menuPrice = menu.variants.find(variant => variant.size === request.body.variant)?.price

    userCart.items.push({...request.body, price: menuPrice, quantity: 1});
  }

  userCart.totalPrice = userCart.calculateTotalPrice();
  return userCart.save();
}

const increaseQuantity = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);

  const menu = userCart.items.id(cartItemId);
  if (!menu) {
    throw new ResponseError(404, "Cart item not found");
  }

  menu.quantity += 1;
  userCart.totalPrice = userCart.calculateTotalPrice();
  return userCart.save();
}

const decreaseQuantity = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);

  const menu = userCart.items.id(cartItemId);
  if (!menu) {
    throw new ResponseError(404, "Cart item not found");
  }

  if(menu.quantity === 1) {
    await deleteCartItem(cartItemId);
  }

  menu.quantity -= 1;
  userCart.totalPrice = userCart.calculateTotalPrice();

  return userCart.save();
}

const deleteCartItem = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);

  const menu = userCart.items.id(cartItemId);
  if (!menu) {
    throw new ResponseError(404, "Cart item not found");
  }

  userCart.items.pull({ _id: cartItemId });
  userCart.totalPrice = userCart.calculateTotalPrice();

  return userCart.save()
}

export default {
  getUserCart,
  initializeNewCart,
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem,
}