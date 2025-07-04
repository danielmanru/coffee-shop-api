import mongoose from "mongoose";

const {Schema, model} = mongoose;

const locationSchema = new Schema({
  alamat: {
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

const imagesSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  publicId: {
    type: String
  }
}, { _id: false });


const outletSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: locationSchema,
    required: true
  },
  images: {
    type: [imagesSchema],
    default: null
  },
  openingHours: {
    type: openingHoursSchema,
    required: true
  },
  isActive : {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

outletSchema.index({
  name : "text",
  "location.alamat" : "text",
  "location.kelurahan" : "text",
  "location.kecamatan" : "text",
})
const Outlet = model('Outlet', outletSchema);

export default Outlet;

