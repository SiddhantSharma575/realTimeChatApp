const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");
const port = 4500 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const users = [{}];
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello its working");
});

const io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(user);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("Welcome", {
      user: "Admin",
      message: `Welcome to the chat ${users[socket.id]} `,
    });
  });

  socket.on("message", () => {});

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", { user: "Admin", message: "User has left" });
    console.log("User left");
  });
});

server.listen(port, () => {
  console.log(`Server is working on ${port}`);
});
