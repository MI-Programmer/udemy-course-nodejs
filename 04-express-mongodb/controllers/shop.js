const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = async (req, res) => {
  const products = await Product.findMany();

  res.render("shop", { pageTitle: "Shop", path: "/", prods: products });
};

exports.getProducts = async (req, res) => {
  const products = await Product.findMany();

  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All products",
    path: "/products",
  });
};

exports.getProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  res.render("shop/product-detail", {
    pageTitle: product.title,
    path: "/products",
    product,
  });
};

exports.getCart = async (req, res) => {
  const products = await User.getCart(req.user.cart);

  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
    products,
  });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "/checkout" });
};

exports.getOrders = async (req, res) => {
  const orders = await User.getOrders(req.user._id);

  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders,
  });
};

exports.postAddCart = async (req, res) => {
  const { productId } = req.body;
  await User.addToCart(req.user._id, productId, req.user.cart);
  res.redirect("/cart");
};

exports.postCreateOrder = async (req, res, next) => {
  await User.createOrder(req.user);
  res.redirect("/orders");
};

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.body;

  await User.deleteCartItem(req.user._id, productId, req.user.cart);
  res.redirect("/cart");
};
