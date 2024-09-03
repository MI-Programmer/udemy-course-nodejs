const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { productValidation } = require("../middleware/validators");
const { catchAsync } = require("../utils/catchAsync");

const router = express.Router();

router.get("/products", isAuth, catchAsync(adminController.getProducts));

router.get("/add-product", isAuth, adminController.getAddProduct);

router.get(
  "/edit-product/:productId",
  isAuth,
  catchAsync(adminController.getEditProduct)
);

router.post(
  "/add-product",
  productValidation,
  isAuth,
  catchAsync(adminController.postAddProduct)
);

router.post(
  "/edit-product",
  productValidation,
  isAuth,
  catchAsync(adminController.postEditProduct)
);

router.delete("/products/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
