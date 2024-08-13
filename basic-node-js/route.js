const fs = require("fs");

const handlerRoutes = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "Text/Html");
    res.write("<html>");
    res.write("<head><title>My first page</title></head>");
    res.write(
      `<body><form action="/message" method="POST"><input type="text" name="message"/><button>Submit</button></form></body>`
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
      console.log(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(parsedBody);

      fs.writeFile("message.txt", message, (error) => {
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "Text/Html");
  res.write("<html>");
  res.write("<head><title>My first page</title></head>");
  res.write("<body><h1>Response from nodejs server!!</h1></body>");
  res.write("</html>");
  res.end();

  // console.log(req.url, req.method, req.headers);
  // process.exit();
};

module.exports = { handlerRoutes };
