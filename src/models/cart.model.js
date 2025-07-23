import {model, Schema, Types} from "mongoose";

const cartItemSchema = new Schema({
  menuId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Menu'
  },
  temperature: {
    type: String,
    required: true,
    enum: ['HOT', 'COLD']
  },
  iceLevel: {
    type: String,
    required: true,
    enum: ['NO_ICE', 'LESS_ICE', 'REGULAR_ICE']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be greater than 0']
  }
});

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: [true, 'Must be a valid user'],
    unique: true,
    ref: 'User'
  },
  menu: {
    type: [cartItemSchema],
    default: [],
  },
}, { timestamps: true });

const Cart = model("Cart", cartSchema);

export default Cart;
