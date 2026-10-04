const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Game server is running"
  });
});

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.emit("serverMessage", {
    message: "Connected to the game server!"
  });

  socket.on("playerJoin", (player) => {
    console.log("Player joined:", player);

    socket.broadcast.emit("playerJoined", {
      id: socket.id,
      player: player
    });
  });

  socket.on("playerMove", (data) => {
    socket.broadcast.emit("playerMoved", {
      id: socket.id,
      position: data.position
    });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    socket.broadcast.emit("playerLeft", {
      id: socket.id
    });
  });
});

server.listen(PORT, () => {
  console.log(`Game server running on port ${PORT}`);
});