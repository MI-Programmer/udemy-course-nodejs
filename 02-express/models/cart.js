const fs = require("fs");
const path = require("path");

const p = path.join(path.dirname(require.main.filename), "data", "cart.json");

module.exports = class Cart {
  static getCartProducts(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) cb([]);
      else cb(JSON.parse(fileContent));
    });
  }

  static addProduct(id, price, cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      let updatedCart;
      if (!err) cart = JSON.parse(fileContent);

      if (cart.products.some((product) => product.id === id))
        updatedCart = {
          products: cart.products.map((product) =>
            product.id === id ? { ...product, qty: product.qty + 1 } : product
          ),
        };
      else updatedCart = { products: [...cart.products, { id, qty: 1 }] };

      updatedCart.totalPrice = cart.totalPrice + +price;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (!err) cb();
        console.log(err);
      });
    });
  }

  static deleteProduct(id, price, cb) {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      const product = cart.products.find((product) => product.id === id);
      if (!product) return;

      const updatedCart = {
        ...cart,
        products: cart.products.filter((product) => product.id !== id),
      };
      updatedCart.totalPrice = cart.totalPrice - product.qty * price;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (!err) cb?.();
        console.log(err);
      });
    });
  }
};
