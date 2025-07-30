import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['small', 'regular', 'large'],
  },
  price: {
    type: Number,
  }
}, {_id: false});

const imagesSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  publicId: {
    type: String
  }
}, {_id: false});

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
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
    type: [imagesSchema],
    default: [],
  },
  variants: {
    type: [variantSchema],
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

const Menu = mongoose.model("Menu", menuSchema);

export default Menu;

