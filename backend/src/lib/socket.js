import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
});

export function getReceiversSocketId(userId){
    return userSocketMap[userId];
}

const userSocketMap = {};

io.on("connection", (socket) => {
    console.log("A user connected ", socket.id);

    socket.userId = socket.handshake.query.userId;

    if (socket.userId) {
        userSocketMap[socket.userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //broadcast the message

    socket.on("disconnect", () => {
        console.log("A user disconnected ", socket.id);
        delete userSocketMap[socket.userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
});


export { io, app, server };