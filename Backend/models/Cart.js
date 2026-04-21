const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userEmail: String,
  items: [
    {
      productId: String,
      quantity: Number
    }
  ]
});

module.exports = CartSchema;