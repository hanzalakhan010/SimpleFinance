const mongoose = require("mongoose");
const transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  categoryColor: {
    type: String,
  },
  date: {
    type: String,
  },
  description: {
    type: String,
  },
},{
    timestamps:true
}
);


const transactionModel = mongoose.model('transactions',transactionSchema)


module.exports = transactionModel