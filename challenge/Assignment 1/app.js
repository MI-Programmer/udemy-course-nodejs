const http = require("http");
const { handlerRoutes } = require("./routes");

const server = http.createServer(handlerRoutes);

server.listen(3000);
