import mongoose from "mongoose";

const {Schema, model, Types} = mongoose;

const paymentSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    required: true,
    ref: 'User'
  },
  orderId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Order'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['gopay', 'cash', 'dana', 'qris'],
    required: true
  },
  paymentReceiptUrl: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'pending'
  }
}, { timestamps: true });

const Payment = model('Payment', paymentSchema);

export default Payment;

