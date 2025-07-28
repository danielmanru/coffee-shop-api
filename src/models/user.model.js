import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
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
  kota: {
    type: String,
    required: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    default: null
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'customer'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String,
    default : null
  }
}, { timestamps : true } );

const User = mongoose.model("User", userSchema);

export default User;