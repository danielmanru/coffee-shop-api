import mongoose from "mongoose";

const {Schema, model} = mongoose;

const locationSchema = new Schema({
  address: {
    type: String,
    required: true
  },
  kecamatan: {
    type: String,
    required: true
  },
  kelurahan: {
    type: String,
    required: true
  },
}, { _id: false });

const openingHoursSchema = new Schema({
  open: {
    type: String,
    required: true
  },
  close: {
    type: String,
    required: true
  },
}, { _id: false });

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  publicId: {
    type: String
  }
}, { _id: false });


const storeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: locationSchema,
    default: null
  },
  image: {
    type: imageSchema,
    default: null
  },
  openingHours: {
    type: openingHoursSchema,
    default: null
  },
}, { timestamps: true });

const Store = model('Store', storeSchema);

export default Store;

