const express = require("express");
const db = require("./config/db");
const bodyParser = require("body-parser");
const allRoutes = require("./routes/allRoutes");
const cors = require("cors");
const http = require("http");
const session = require('express-session');
const crypto = require('crypto');
const { all } = require("axios");
const app = express();
const server = http.createServer(app);
const PORT = 5000;
// const io = require("socket.io")(server)


// CORS Configuration
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
      secure: false, // Use true if on HTTPS
      httpOnly: true,
    },
  })
);

app.use(express.json());
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

// // Socket.IO setup
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Listen for 'newPost' event from the client and broadcast it to all connected clients
//   socket.on("newPost", (postData) => {
//     console.log("New post uploaded:", postData);
//     io.emit("updateFeed", postData); // Emit the new post to all connected clients
//   });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("A user disconnected");
//   });
// });


 app.use(allRoutes);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
