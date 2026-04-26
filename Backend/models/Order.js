const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  items: Array,
  total: Number,
  paymentMethod: String,  
  paymentStatus: String,
  orderStatus: {
    type: String,
    default: "Pending"
  },
  orderDate: {
    type: Date,
    default: Date.now      
  }
});

module.exports = mongoose.model("Order", OrderSchema);