import { Server as SocketServer } from "socket.io";

let socketIo;

const socket = {
  init: (serverExpress) => {
    try {
      socketIo = new SocketServer(serverExpress, {
        cors: { origin: "*", methods: ["GET", "POST"] },
      });

      console.log("Socket.io initialized successfully");
      return socketIo;
    } catch (error) {
      console.error("Error initializing Socket.io:", error);
    }
  },
  getIO: () => {
    if (!socketIo) {
      throw new Error("Socket.io not initialized");
    }
    return socketIo;
  },
};

export default socket;
