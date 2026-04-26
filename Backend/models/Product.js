const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }
});


module.exports = mongoose.model("Product", ProductSchema);