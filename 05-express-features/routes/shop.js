const express = require("express");

const router = express.Router();

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");
const { catchAsync } = require("../utils/catchAsync");

router.get("/", catchAsync(shopController.getIndex));

router.get("/products", catchAsync(shopController.getProducts));

router.get("/products/:productId", catchAsync(shopController.getProduct));

router.get("/cart", isAuth, catchAsync(shopController.getCart));

router.get("/orders", isAuth, catchAsync(shopController.getOrders));

router.get("/checkout", isAuth, catchAsync(shopController.getCheckout));

router.get(
  "/checkout/success",
  isAuth,
  catchAsync(shopController.getCheckoutSuccess)
);

router.get("/checkout/cancel", isAuth, catchAsync(shopController.getCheckout));

router.get("/order/:orderId", isAuth, catchAsync(shopController.getInvoice));

router.post("/cart", isAuth, catchAsync(shopController.postAddCart));

// router.post(
//   "/create-order",
//   isAuth,
//   catchAsync(shopController.postCreateOrder)
// );

router.post(
  "/cart-delete-item",
  isAuth,
  catchAsync(shopController.deleteCartItem)
);

module.exports = router;
