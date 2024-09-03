const express = require("express");

const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/products", adminController.getProducts);

router.get("/add-product", adminController.getAddProduct);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/add-product", adminController.postAddProduct);

router.post("/edit-product/:productId", adminController.postEditProduct);

router.post("/delete-product/:productId", adminController.deleteProduct);

module.exports = router;
