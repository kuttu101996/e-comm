const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  cartProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  cartCombo: { type: mongoose.Schema.Types.ObjectId, ref: "ComboOffer" },
  price: Number,
  discountedTotal: Number,
  quantity: { type: Number, required: true, default: 1 },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
