// const mongoose = require("mongoose");

// const orderItemSchema = mongoose.Schema({
//   quantity: {
//     type: Number,
//     required: true,
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true,
//   },
// });
// //_id ko id convert karne ke liye

// module.exports = mongoose.model("OrderItem", orderItemSchema);

const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

exports.OrderItem = mongoose.model("OrderItem", orderItemSchema);
