const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number,
  offer: Number
});

const Product = mongoose.model("Product", productSchema)

module.exports = Product