const fs = require("fs");

exports.deleteFileImage = (path) =>
  fs.unlink(path, (err) => {
    if (err) throw new Error(err);
  });
