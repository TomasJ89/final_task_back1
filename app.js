const express = require("express");
const http = require("http"); // Import http module to create an HTTP server
const cors = require("cors");
const mongoose = require("mongoose");
const {Server} = require("socket.io");
const mainRouter = require("./routers/mainRouter");

require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create the HTTP server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

mongoose.connect(process.env.MONGO_KEY)
    .then(() => {
        console.log("DB connect success");
    })
    .catch(err => {
        console.error("DB connection error:", err);
    });

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);


let onlineUsers = [];

io.on("connection", (socket) => {
    socket.on("login", (user) => {
        if (!onlineUsers.some(usr => usr.userId === user._id)) {
            onlineUsers.push({ userId: user._id, socketId: socket.id, conversationsId: null });
        }
        console.log("Connected Users:", onlineUsers);
        io.emit("getUsers", onlineUsers);
    });

    socket.on("joinRoom", ({  conversationsId }) => {
        socket.join(conversationsId);

        const room = io.of('/').adapter.rooms.get(conversationsId);
        const roomUsers = Array.from(room)
        const filteredUsers = onlineUsers.filter(user => roomUsers.includes(user.socketId));

        io.to(conversationsId).emit("roomUsers", filteredUsers)

    });

    socket.on("leaveRoom", ({  conversationsId }) => {
        socket.leave(conversationsId);

        const room = io.of('/').adapter.rooms.get(conversationsId);
        if(room) {
            const roomUsers = Array.from(room)
            const filteredUsers = onlineUsers.filter(user => roomUsers.includes(user.socketId));
            io.to(conversationsId).emit("roomUsers", filteredUsers)
        }


    });

    socket.on("newMessage", (message) => {
        io.to(message.conversationsId).emit("addMessage", message);
    });
    socket.on("like", (conversationsId) => {
        io.to(conversationsId).emit("likedMsg")
    })

    socket.on("logout", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        console.log("User disconnected:", onlineUsers);
        io.emit("getUsers", onlineUsers);
    });
    socket.on("conv",(id) => {
        const recipient = onlineUsers.find(x => x.userId === id);
        if (recipient) {
            io.to(recipient.socketId).emit("update");
        }

    })
    socket.on("updateProfile",()=> {
        socket.broadcast.emit("updatedProfile");
    })

    socket.on("updatedUser", (recipient) => {
        const findRecipient = onlineUsers.find(x => x.userId === recipient._id);
        if (findRecipient) {
            // io.to(findRecipient.socketId).emit("updatedRecipient", recipient);
            //trint
            io.to(findRecipient.socketId).emit("update");
        }
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id);
        console.log("User disconnected:", onlineUsers);
        io.emit("getUsers", onlineUsers);
    });
});


server.listen(2000, () => {
    console.log("Server is running on http://localhost:2000");
});