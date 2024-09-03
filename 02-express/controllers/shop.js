const Cart = require("../models/cart");
const Product = require("../models/product");

exports.getIndex = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop", { pageTitle: "Shop", path: "/", prods: products });
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All products",
      path: "/products",
    });
  });
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    res.render("shop/product-detail", {
      pageTitle: product.title,
      path: "/products",
      product,
    });
  });
};

exports.getCart = (req, res) => {
  Cart.getCartProducts((cartProductsData) => {
    Product.fetchAll((products) => {
      const cartProducts = products
        .filter((product) =>
          cartProductsData.products.some((item) => item.id === product.id)
        )
        .map((item) => {
          const cartProduct = cartProductsData.products.find(
            (el) => el.id === item.id
          );
          if (cartProduct) return { ...item, ...cartProduct };
          else item;
        });

      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        cartProducts,
      });
    });
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { pageTitle: "Your Orders", path: "/orders" });
};

exports.postAddCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price, () => {
      res.redirect("/cart");
    });
  });
};

exports.deleteCartItem = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price, () => {
      res.redirect("/cart");
    });
  });
};
