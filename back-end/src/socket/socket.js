const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        socket.on("join", (userId) => {
            console.log("JOIN EVENT:", userId);
            socket.join(userId);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }

    return io;
};

module.exports = {
    initSocket,
    getIO
};