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

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  publicId: {
    type: String
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
  images: {
    type: [imageSchema],
    default: [],
  },
  variants: {
    type: [variantSchema],
    default: [],
  }
}, { timestamps: true });

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;

