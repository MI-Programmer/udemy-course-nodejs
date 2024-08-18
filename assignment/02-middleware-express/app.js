import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log("MIdlleware 1");
  next();
});

app.use((req, res, next) => {
  console.log("MIdlleware 2");
  next();
});

app.use("/users", (req, res, next) => {
  res.send("<h1>Users</h1>");
});

app.use("", (req, res, next) => {
  res.send("<h1>Hello man</h1>");
});

app.listen(3000);
