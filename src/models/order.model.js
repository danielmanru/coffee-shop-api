import mongoose from "mongoose";

const {Schema, model, Types} = mongoose;

const orderItemSchema = new Schema({
  menuId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Menu'
  },
  name: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const orderSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  storeId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Store'
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  deliveryFee:{
    type: Number,
    required: true,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'completed'],
    default: 'pending'
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pick-up', 'dine-in'],
    required: true
  }
}, { timestamps: true });

const Order = model('Order', orderSchema);

export default Order;

