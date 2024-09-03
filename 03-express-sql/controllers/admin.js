const Product = require("../models/product");

exports.getProducts = (req, res) => {
  req.user
    .getProducts()
    .then((result) => {
      const products = result.map((item) => item.dataValues);

      res.render("admin/products", {
        pageTitle: "Admin Products",
        path: "/admin/products",
        prods: products,
      });
    })
    .catch((err) => console.log(err));
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
  Product.findByPk(productId)
    .then((result) => {
      const product = result.dataValues;

      res.render("admin/edit-product", {
        pageTitle: "Edit product",
        path: "/admin/edit-product",
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddProduct = (req, res) => {
  req.user
    .createProduct(req.body)
    .then((result) => {
      // console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const { productId } = req.params;
  Product.update(req.body, { where: { id: productId } })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const { productId } = req.params;
  Product.destroy({ where: { id: productId } })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
