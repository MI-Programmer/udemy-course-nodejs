const http = require("http");
const { handlerRoutes } = require("./route");

const server = http.createServer(handlerRoutes);

server.listen(3000);
