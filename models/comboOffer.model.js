const mongoose = require("mongoose");

const comboSchema = mongoose.Schema({
  comboName: String,
  discountPercent: Number,
  comboItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const ComboOffer = mongoose.model("ComboOffer", comboSchema);

module.exports = ComboOffer;
