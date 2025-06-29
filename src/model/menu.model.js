import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['small', 'regular', 'large'],
  },
  price: {
    type: Number,
  }
}, { _id: false });

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    required: true,
    enum: ['coffee', 'non-coffee', 'food'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  variants: {
    type: [variantSchema],
    default: null,
  }
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;

