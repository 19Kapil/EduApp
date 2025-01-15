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

 app.use(allRoutes);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
