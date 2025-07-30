import mongoose from "mongoose";

const {Schema, model, Types} = mongoose;

const orderItemSchema = new Schema({
  menuId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Menu'
  },
  temperature: {
    type: String,
    required: true,
    enum: ['hot', 'cold']
  },
  iceLevel: {
    type: String,
    required: true,
    enum: ['no_ice', 'less_ice', 'regular_ice'],
    validate: {
      validator: function (value) {
        return !(this.temperature === 'hot' && value !== 'no_ice');

      },
      message: props => "if  the temperature is 'hot', then ice level must be 'no_ice'"
    }
  },
  variant: {
    type: String,
    required: true,
    enum: ['small', 'regular', 'large']
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be greater than 0']
  }
}, {_id: false});

const orderSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  outletId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Outlet'
  },
  items: {
    type: [orderItemSchema],
    required: true,
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pick_up', 'dine_in'],
    required: true
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, "total price should be greater than 0"]
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'on_delivery', 'cancelled', 'completed'],
    default: 'pending'
  }

}, {timestamps: true,
  versionKey: false});

orderSchema.methods.calculateTotalPrice = function () {
  return this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0) + this.deliveryFee;
};

const Order = model('Order', orderSchema);

export default Order;

