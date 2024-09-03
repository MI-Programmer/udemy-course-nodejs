const Product = require("../models/product");

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((result) => {
      const products = result.map((item) => item.dataValues);

      res.render("shop", { pageTitle: "Shop", path: "/", prods: products });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((result) => {
      const products = result.map((item) => item.dataValues);

      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findByPk(productId)
    .then((result) => {
      const product = result.dataValues;

      res.render("shop/product-detail", {
        pageTitle: product.title,
        path: "/products",
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = async (req, res) => {
  const cart = await req.user.getCart();
  const products = await cart.getProducts();

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
  const orders = await req.user.getOrders({ include: ["products"] });
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
    orders,
  });
};

exports.postAddCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await req.user.getCart();
  const productCart = await cart.getProducts({ where: { id: productId } });
  const product = await Product.findByPk(productId);
  let quantity = productCart[0]?.cartItem?.quantity || 1;

  if (productCart.length) quantity += 1;
  await cart.addProduct(product, { through: { quantity } });
  res.redirect("/cart");
};

exports.postCreateOrder = async (req, res, next) => {
  try {
    const cart = await req.user.getCart();
    const products = await cart.getProducts();

    if (!products.length) return res.redirect("/cart");
    const order = await req.user.createOrder();

    for (const product of products) {
      await order.addProduct(product, {
        through: { quantity: product.cartItem.quantity },
      });
    }

    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (error) {
    next(error);
  }
};

exports.deleteCartItem = async (req, res) => {
  const { productId } = req.params;

  const cart = await req.user.getCart();
  const products = await cart.getProducts({ where: { id: productId } });
  await products[0].cartItem.destroy();

  res.redirect("/cart");
};
