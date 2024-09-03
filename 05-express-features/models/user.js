const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (productId) {
  let cartItems = this.cart.items;
  const existingItem = cartItems.some(
    (item) => item.productId.toString() === productId
  );

  if (existingItem)
    cartItems = cartItems.map((item) =>
      item.productId.toString() === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  else cartItems.push({ productId, quantity: 1 });
  this.cart.items = cartItems;

  await this.save();
};

userSchema.methods.removeFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId
  );
  this.cart.items = updatedCartItems;

  await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  await this.save();
};

module.exports = model("User", userSchema);
