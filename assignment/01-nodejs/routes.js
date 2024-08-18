const handlerRoutes = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.setHeader("Content-Type", "Text/Html");
    res.write("<html>");
    res.write(
      "<body><h1>Hello user</h1><form action='/create-user' method='POST'><input type='text' name='name' /><button>Submit</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "Text/Html");
    res.write("<html>");
    res.write("<body><ol><li>user 1</li></ol></body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const formData = Buffer.concat(body).toString();
      console.log(formData);
    });

    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }
};

module.exports = { handlerRoutes };
