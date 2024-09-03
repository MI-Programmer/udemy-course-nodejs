const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) cb([]);
    else cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor({ title, imageUrl, price, description }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      if (!product) return cb(null, { mesaage: "Not found product" });
      cb(product);
    });
  }

  static updateById(id, data, cb) {
    getProductsFromFile((products) => {
      const productsUpdated = products.map((product) =>
        product.id === id ? { ...product, ...data } : product
      );

      fs.writeFile(p, JSON.stringify(productsUpdated), (err) => {
        if (!err) cb();
        console.log(err);
      });
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      const productsDelete = products.filter((product) => product.id !== id);

      fs.writeFile(p, JSON.stringify(productsDelete), (err) => {
        if (!err) Cart.deleteProduct(id, product.price);
        console.log(err);
      });
    });
  }
};
