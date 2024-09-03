const { ObjectId } = require("mongodb");
const { getDB } = require("../utils/database");

const db = () => getDB().collection("products");

class Product {
  constructor({ title, price, imageUrl, description, userId }) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this.userId = userId;
  }

  async save() {
    await db().insertOne(this);
  }

  static async findMany() {
    return await db().find().toArray();
  }

  static async findById(id) {
    return await db().findOne({ _id: new ObjectId(id) });
  }

  static async updateById(id, data) {
    await db().updateOne({ _id: new ObjectId(id) }, { $set: data });
  }

  static async deleteById(id) {
    await db().deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Product;
