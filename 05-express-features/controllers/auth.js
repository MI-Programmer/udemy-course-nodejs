const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");
require("dotenv").config();

const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: req.flash("error")[0],
    inputs: null,
    validationErrors: [],
  });
};

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: req.flash("error")[0],
    inputs: null,
    validationErrors: [],
  });
};

exports.getResetPassword = (req, res) => {
  res.render("auth/reset-password", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: req.flash("error")[0],
  });
};

exports.getNewPassword = async (req, res) => {
  const { resetToken } = req.params;
  const user = await User.findOne({
    resetToken,
    resetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) return res.redirect("/");

  res.render("auth/new-password", {
    pageTitle: "New Password",
    path: "/new-password",
    errorMessage: req.flash("error")[0],
    userId: user._id,
    resetToken,
  });
};

exports.postLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      inputs: req.body,
      validationErrors: errors.array(),
    });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: "Email is not found!",
      inputs: req.body,
      validationErrors: [{ path: "email" }],
    });

  const isValidPass = await bcrypt.compare(password, user.password);
  if (!isValidPass)
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: "Password is incorrect!",
      inputs: req.body,
      validationErrors: [{ path: "password" }],
    });

  req.session.isLoggedIn = true;
  req.session.userId = user._id;
  await req.session.save();
  res.redirect("/");
};

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      inputs: req.body,
      validationErrors: errors.array(),
    });

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({ email, password: hashedPassword });

  sgMail.send({
    to: email,
    from: "m.ilham.programmer@gmail.com",
    subject: "Signup succeeded!",
    html: "<h1>You succesfully signed up with email!</h1>",
  });
  res.redirect("/login");
};

exports.postLogout = async (req, res) => {
  await req.session.destroy();
  res.redirect("/");
};

exports.postResetPassword = async (req, res) => {
  const token = await new Promise((resolve, reject) =>
    crypto.randomBytes(32, (err, buffer) => {
      if (err) reject(err);
      resolve(buffer.toString("hex"));
    })
  );

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash("error", "No account with that email found.");
    return res.redirect("/reset-password");
  }
  user.resetToken = token;
  user.resetTokenExpiration = Date.now() + 3600000;
  await user.save();

  sgMail.send({
    to: user.email,
    from: "m.ilham.programmer@gmail.com",
    subject: "Password reset!",
    html: ` <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/new-password/${token}" target="_blank">link</a> to set a new password</p>`,
  });
  res.redirect("/");
};

exports.postNewPassword = async (req, res) => {
  const { userId, password, resetToken } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.updateOne(
    { _id: userId, resetToken, resetTokenExpiration: { $gt: Date.now() } },
    {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiration: null,
    }
  );
  res.redirect("/login");
};
