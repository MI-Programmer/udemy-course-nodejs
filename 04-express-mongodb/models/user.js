const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

const db = () => getDB().collection("users");
const Product = () => getDB().collection("products");
const Order = () => getDB().collection("orders");

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  async save() {
    await db().insertOne(this);
  }

  static async findById(id) {
    return await db().findOne({ _id: new ObjectId(id) });
  }

  static async addToCart(userId, productId, cart) {
    let userCartItems = cart?.items || [];
    const existingItem = userCartItems.some(
      (item) => item.productId.toString() === productId
    );

    if (existingItem)
      userCartItems = userCartItems.map((item) =>
        item.productId.toString() === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    else
      userCartItems.push({ productId: new ObjectId(productId), quantity: 1 });

    await db().updateOne(
      { _id: userId },
      { $set: { cart: { items: userCartItems } } }
    );
  }

  static async createOrder(user) {
    const cartItems = await User.getCart(user.cart);
    const newOrder = {
      user: { id: user._id, name: user.name },
      items: cartItems.map(({ title, quantity, price }) => ({
        title,
        quantity,
        price,
      })),
    };

    await Order().insertOne(newOrder);
    await db().updateOne({ _id: user._id }, { $set: { cart: { items: [] } } });
  }

  static async getOrders(userId) {
    const orders = await Order()
      .find({ "user.id": new ObjectId(userId) })
      .toArray();
    return orders;
  }

  static async getCart(cart) {
    if (!cart?.items.length) return [];

    const productIds = cart.items.map((item) => item.productId);
    const products = await Product()
      .find({ _id: { $in: productIds } })
      .toArray();
    const cartItems = products.map((product) => {
      const item = cart.items.find(
        (value) => value.productId.toString() === product._id.toString()
      );

      return { ...product, quantity: item.quantity };
    });

    return cartItems;
  }

  static async deleteCartItem(userId, itemId, cart) {
    const cartUpdated = cart.items.filter(
      (item) => item.productId.toString() !== itemId
    );

    await db().updateOne(
      { _id: userId },
      { $set: { cart: { items: cartUpdated } } }
    );
  }
}

module.exports = User;
