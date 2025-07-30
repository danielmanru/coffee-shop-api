import mongoose from "mongoose";

const {Schema, model, Types} = mongoose;

const paymentReceiptSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: props => `The amount must be greater than 0`,
    }
  },
  paidAt: {
    type: Date,
    required: true,
  }
}, {_id: false})

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
  paymentReceipt: {
    type: paymentReceiptSchema,
    default: null
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'expired', 'cancelled'],
    default: 'unpaid',
    validate: {
      validator: function (value) {
        return !(value === 'paid' && this.paymentReceipt === null)
      },
      message: props => `If status paid the payment receipt must be filled`,
    }
  },
  paymentUrl: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

const Payment = model('Payment', paymentSchema);

export default Payment;

