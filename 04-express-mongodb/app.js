const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
const { mongoConnect } = require("./utils/database");
const User = require("./models/user");

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  // const user = new User("MI Programmer", "test@gmail.com");
  // await user.save();
  const user = await User.findById("66cc5e76784eb283c0ee96ae");
  req.user = user;
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

const startServer = async () => {
  try {
    await mongoConnect();
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

startServer();
