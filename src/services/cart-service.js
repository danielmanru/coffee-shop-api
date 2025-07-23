import Cart from "../models/cart.model.js";
import {ResponseError} from "../error/response-error.js";

const initializeNewCart = async (user_id) => {
  await Cart.create({userId: user_id});
}

const getUserCart = async (user_id) => {
  const userCart = await Cart.find({userId: user_id});

  if (!userCart) {
    throw new ResponseError("Cart not found");
  }

  return userCart;
}

const addItemToCart = async (request) => {
  const existingCart = await Cart.find({userId: request.user._id});

  if (!existingCart) {
    await initializeNewCart(request.user._id);
  }

  let userCart = await getUserCart(request.user._id);

  const existingCartItem = await Cart.find({
    $and: [
      {userId: request.user._id},
      {
        menu: {
          $elemMatch: {
            menuId: request.body.menu.menuId,
            temperature: request.body.menu.temperature,
            iceLevel: request.body.menu.iceLevel
          }
        }
      }
    ]
  })

  if (existingCartItem) {
    existingCartItem.menu.quantity += 1;
    await existingCartItem.save();
  }

  request.body.menu.quantity = 1;
  userCart.menu.push(request.body);
  return userCart.save();
}

const increaseQuantity = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);
  if(!userCart) {
    throw new ResponseError("Cart not found");
  }

  const menu = userCart.menu.id(cartItemId);
  if (!menu) {
    throw new ResponseError("Cart item not found");
  }

  menu.quantity += 1;

  return userCart.save();
}

const decreaseQuantity = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);
  if(!userCart) {
    throw new ResponseError("Cart not found");
  }

  const menu = userCart.menu.id(cartItemId);
  if (!menu) {
    throw new ResponseError("Cart item not found");
  }

  if(menu.quantity === 1) {
    await deleteCartItem(cartItemId);
  }

  menu.quantity -= 1;

  return userCart.save();
}

const deleteCartItem = async (user_id, cartItemId) => {
  const userCart = await getUserCart(user_id);
  if(!userCart) {
    throw new ResponseError("Cart not found");
  }

  const menu = userCart.menu.id(cartItemId);
  if (!menu) {
    throw new ResponseError("Cart item not found");
  }

  menu.remove();

  return userCart.save();
}

export default {
  getUserCart,
  addItemToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteCartItem,
}