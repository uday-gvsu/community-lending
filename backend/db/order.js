const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  borrowerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  borrowedAt: { type: Date, default: Date.now },
  numberOfDays: Number,
  price: Number,
  rating: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;