const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transaction: {
      type: String,
      trim: true,
      require: true,
    },
    date: {
      type: Date,
      require: true,
      default: Date.now,
    },
  },
  { versionKey: false }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
