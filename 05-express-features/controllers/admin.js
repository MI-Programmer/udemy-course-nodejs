const { validationResult } = require("express-validator");

const Product = require("../models/product");
const { deleteFileImage } = require("../utils/helper");

const ITEMS_PER_PAGE = 2;

exports.getProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const products = await Product.find({ userId: req.user._id })
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const productsLength = await Product.countDocuments({ userId: req.user._id });

  res.render("admin/products", {
    pageTitle: "Admin Products",
    path: "/admin/products",
    prods: products,
    amountPage: Math.ceil(productsLength / ITEMS_PER_PAGE),
    activePage: page,
  });
};

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add product",
    path: "/admin/add-product",
    errorMessage: null,
    product: null,
    edit: false,
    validationErrors: [],
  });
};

exports.getEditProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  res.render("admin/edit-product", {
    pageTitle: "Edit product",
    path: "/admin/edit-product",
    errorMessage: null,
    edit: true,
    product,
    validationErrors: [],
  });
};

exports.postAddProduct = async (req, res) => {
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty() || !image)
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add product",
      path: "/add-product",
      edit: false,
      errorMessage: errors.array()[0]?.msg || "Attached file is not an image.",
      product: req.body,
      validationErrors: errors.array(),
    });

  await Product.create({
    ...req.body,
    imageUrl: image.path,
    userId: req.user,
  });
  res.redirect("/admin/products");
};

exports.postEditProduct = async (req, res) => {
  const { productId } = req.body;
  const errors = validationResult(req);
  const image = req.file ? { imageUrl: req.file.path } : {};

  if (!errors.isEmpty())
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit product",
      path: "/edit-product",
      edit: true,
      errorMessage: errors.array()[0].msg,
      product: req.body,
      validationErrors: errors.array(),
    });

  if (req.file) {
    const product = await Product.findById(productId);
    deleteFileImage(product.imageUrl);
  }

  await Product.updateOne(
    { _id: productId, userId: req.user._id },
    { ...req.body, ...image }
  );
  res.redirect("/admin/products");
};

exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findOneAndDelete({
      _id: productId,
      userId: req.user._id,
    });
    if (!product) throw new Error("Not found product!");

    deleteFileImage(product.imageUrl);
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    res.status(500).json({ message: "Deleting product failed." });
  }
};
