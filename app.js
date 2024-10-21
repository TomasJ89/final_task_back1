const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const mainRouter = require("./routers/mainRouter");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const localHost = "http://localhost:5173";
const productionHost = "https://final-task-back1.onrender.com";
const io = new Server(server, {
  cors: {
    origin: productionHost,
    methods: ["GET", "POST"],
  },
});

mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("DB connect success");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("login", (user) => {
    if (!onlineUsers.some((usr) => usr.userId === user._id)) {
      onlineUsers.push({
        userId: user._id,
        socketId: socket.id,
        conversationsId: null,
      });
    }
    console.log("Connected Users:", onlineUsers);
    io.emit("getUsers", onlineUsers);
  });

  socket.on("joinRoom", ({ conversationsId }) => {
    socket.join(conversationsId);

    const room = io.of("/").adapter.rooms.get(conversationsId);
    const roomUsers = Array.from(room);
    const filteredUsers = onlineUsers.filter((user) =>
      roomUsers.includes(user.socketId)
    );

    io.to(conversationsId).emit("roomUsers", filteredUsers);
  });

  socket.on("leaveRoom", ({ conversationsId }) => {
    socket.leave(conversationsId);

    const room = io.of("/").adapter.rooms.get(conversationsId);
    if (room) {
      const roomUsers = Array.from(room);
      const filteredUsers = onlineUsers.filter((user) =>
        roomUsers.includes(user.socketId)
      );
      io.to(conversationsId).emit("roomUsers", filteredUsers);
    }
  });

  socket.on("newMessage", (message) => {
    io.to(message.conversationsId).emit("addMessage", message);
  });
  socket.on("like", (conversationsId) => {
    io.to(conversationsId).emit("likedMsg");
  });

  socket.on("logout", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected:", onlineUsers);
    io.emit("getUsers", onlineUsers);
  });
  socket.on("conv", (id) => {
    const recipient = onlineUsers.find((x) => x.userId === id);
    if (recipient) {
      io.to(recipient.socketId).emit("update");
    }
  });
  socket.on("updateProfile", () => {
    socket.broadcast.emit("updatedProfile");
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log("User disconnected:", onlineUsers);
    io.emit("getUsers", onlineUsers);
  });
});

// server.listen(2000, () => {
//     console.log("Server is running on http://localhost:2000");
// });
// Use the environment variable PORT or default to 2000
const PORT = process.env.PORT || 2000;

// Bind the server to 0.0.0.0 and the correct port
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
