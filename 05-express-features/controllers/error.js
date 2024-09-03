exports.get404 = (req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page not found", path: "" });
};

exports.get500 = (err, req, res, next) => {
  console.error(err);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "",
  });
};
