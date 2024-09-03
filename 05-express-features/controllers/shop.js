const fs = require("fs/promises");
const { createReadStream, createWriteStream } = require("fs");
const path = require("path");

require("dotenv").config();
const PDFDocument = require("pdfkit");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Product = require("../models/product");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 2;

exports.getIndex = async (req, res) => {
  const page = +req.query.page || 1;
  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const productsLength = await Product.countDocuments();

  res.render("shop", {
    pageTitle: "Shop",
    path: "/",
    prods: products,
    amountPage: Math.ceil(productsLength / ITEMS_PER_PAGE),
    activePage: page,
  });
};

exports.getProducts = async (req, res) => {
  const page = +req.query.page || 1;
  const products = await Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);

  const productsLength = await Product.countDocuments();

  res.render("shop/product-list", {
    prods: products,
    pageTitle: "All products",
    path: "/products",
    amountPage: Math.ceil(productsLength / ITEMS_PER_PAGE),
    activePage: page,
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
  const user = await req.user.populate("cart.items.productId");

  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
    products: user.cart.items,
  });
};

exports.getCheckout = async (req, res) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items;
  const totalSum = products.reduce(
    (acc, curr) => acc + curr.productId.price,
    0
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: products.map(({ productId, quantity }) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: productId.title,
          description: productId.description,
        },
        unit_amount: productId.price * 100,
      },
      quantity,
    })),
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
    cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
  });

  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    products,
    totalSum,
    sessionId: session.id,
  });
};

exports.getCheckoutSuccess = async (req, res) => {
  const user = await req.user.populate("cart.items.productId");
  const products = user.cart.items.map(
    ({ quantity, productId: { title, price } }) => ({
      quantity,
      title,
      price,
    })
  );

  await Order.create({
    user: { email: user.email, id: user },
    products,
  });
  await user.clearCart();
  res.redirect("/orders");
};

exports.getOrders = async (req, res) => {
  const orders = await Order.find({ "user.id": req.user._id });

  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders,
  });
};

exports.getInvoice = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) throw new Error("No order found");
  if (order.user.id.toString() !== req.user._id.toString())
    throw new Error("Unauthorized");

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoice", invoiceName);
  // const invoiceFile = await fs.readFile(invoicePath);
  // const file = createReadStream(invoicePath);

  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

  pdfDoc.pipe(createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  let totalPrice = 0;
  pdfDoc.fontSize(26).text("Invoice", { underline: true });
  pdfDoc.text("----------------------");
  order.products.forEach(({ title, price, quantity }) => {
    totalPrice += price * quantity;
    pdfDoc.fontSize(14).text(`${title} - ${quantity} x $${price}`);
  });
  pdfDoc.text("-----");
  pdfDoc.fontSize(20).text(`Total price: $${totalPrice}`);
  pdfDoc.end();

  // file.pipe(res);
  // res.send(invoiceFile);
};

exports.postAddCart = async (req, res) => {
  const { productId } = req.body;
  await req.user.addToCart(productId);
  res.redirect("/cart");
};

// exports.postCreateOrder = async (req, res) => {
//   const user = await req.user.populate("cart.items.productId");
//   const products = user.cart.items.map(
//     ({ quantity, productId: { title, price } }) => ({
//       quantity,
//       title,
//       price,
//     })
//   );

//   await Order.create({
//     user: { email: user.email, id: user },
//     products,
//   });
//   await user.clearCart();
//   res.redirect("/orders");
// };

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.body;
  await req.user.removeFromCart(productId);
  res.redirect("/cart");
};
