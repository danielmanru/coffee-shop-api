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
});

const cartSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: [true, 'Must be a valid user'],
    unique: true,
    ref: 'User'
  },
  items: {
    type: [cartItemSchema],
    default: [],
  },
  totalPrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

cartSchema.methods.calculateTotalPrice = function () {
  return this.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
};

const Cart = model("Cart", cartSchema);

export default Cart;
