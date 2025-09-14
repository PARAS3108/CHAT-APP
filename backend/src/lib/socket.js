import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
// used to store online users
const userSocketMap = {}; //{userId:socketId}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Read userId from handshake.auth (recommended) with fallback to query for compatibility
  const userId =
    socket.handshake.auth?.userId || socket.handshake.query?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }
  io.emit("online-users", Object.keys(userSocketMap)); //send to all connected clients

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("online-users", Object.keys(userSocketMap)); //send to all connected clients
  });
});
export { io, app, server };
