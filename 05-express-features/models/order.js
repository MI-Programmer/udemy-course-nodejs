const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  products: [
    {
      title: { type: String, required: true },
      price: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  user: {
    email: { type: String, required: true },
    id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
});

module.exports = model("Order", orderSchema);
