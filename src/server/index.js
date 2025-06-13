const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

let currentPoll = null;
let responses = [];

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Send current poll when someone joins
  if (currentPoll) socket.emit("poll", currentPoll);

  socket.on("create_poll", (poll) => {
    currentPoll = poll;
    responses = [];
    io.emit("poll", poll);
  });

  socket.on("submit_response", (response) => {
    responses.push(response);
    io.emit("response_update", responses);
  });

  socket.on("end_poll", () => {
    currentPoll = null;
    responses = [];
    io.emit("poll_ended");
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Server running on http://localhost:5000"));
