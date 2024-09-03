const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      pageTitle: "Admin Products",
      path: "/admin/products",
      prods: products,
    });
  });
};

exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    product: null,
  });
};

exports.getEditProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId, (product, err) => {
    if (err) return res.redirect("/");

    res.render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/admin/edit-product",
      product,
    });
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body);
  product.save();
  res.redirect("/");
};

exports.postEditProduct = (req, res) => {
  const { productId } = req.params;
  Product.updateById(productId, req.body, () => {
    res.redirect("/admin/products");
  });
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.params;
  Product.deleteById(productId);
  res.redirect("/admin/products");
};
