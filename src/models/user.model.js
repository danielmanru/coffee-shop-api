import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  alamat: {
    type: String,
  },
  kecamatan: {
    type: String,
  },
  kelurahan: {
    type: String,
  },
  kota: {
    type: String,
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
    default : ""
  }
}, { timestamps : true } );

const User = mongoose.model("User", userSchema);

export default User;