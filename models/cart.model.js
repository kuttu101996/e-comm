const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  cartProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  cartCombo: { type: mongoose.Schema.Types.ObjectId, ref: "ComboOffer" },
  price: Number,
  discountedTotal: Number
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
