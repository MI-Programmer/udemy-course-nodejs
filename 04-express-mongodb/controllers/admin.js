const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  const products = await Product.findMany();

  res.render("admin/products", {
    pageTitle: "Admin Products",
    path: "/admin/products",
    prods: products,
  });
};

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    product: null,
  });
};

exports.getEditProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  res.render("admin/edit-product", {
    pageTitle: "Edit product",
    path: "/admin/edit-product",
    product,
  });
};

exports.postAddProduct = async (req, res) => {
  const product = new Product({ ...req.body, userId: req.user._id });
  await product.save();
  res.redirect("/admin/products");
};

exports.postEditProduct = async (req, res) => {
  const { productId } = req.body;
  delete req.body.productId;
  await Product.updateById(productId, req.body);
  res.redirect("/admin/products");
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.body;
  await Product.deleteById(productId);
  res.redirect("/admin/products");
};
