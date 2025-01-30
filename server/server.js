const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
const allRoutes = require("./routes/allRoutes");
//const agora = require("./config/agora");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const crypto = require("crypto");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = 5000;

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// CORS configuration
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

// Middleware
app.use(
  session({
    secret: crypto.randomBytes(64).toString('hex'), 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      httpOnly: true,
    },
  })
);
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// MySQL Database Connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Handle socket.io connections
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    if (!room) {
      console.error("Attempted to join an undefined room");
      return;
    }
    socket.join(room);
  });
  // message handling
  socket.on("sendMessage", (message) => {
    const { room } = message;

    if (!room) {
      console.error("Room is undefined in the received message:", message);
      return;
    }

    io.to(room).emit("newMessage", message);
    console.log(`Message emitted to room: ${room}`);
  });

  socket.on("disconnect", () => {});
});


app.use(allRoutes);
// app.use("/agora", agora);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
