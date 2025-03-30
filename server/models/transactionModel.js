const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
  },
  type: {
    type: String
    , required: true,
  },
  category: {
    type: String
    , required: true,

  },
  categoryColor: {
    type: String
    , required: true,

  },
  date: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
}, {
  timestamps: true
}
);


const transactionModel = mongoose.model('transactions', transactionSchema)


module.exports = transactionModel