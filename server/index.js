require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const bodyParser = require('body-parser')
const app = express();

// Middleware
app.use(bodyParser.json())

// Connect Database
connectDB();

// Define Routes
app.use("/api/users", require("./api/users"));
app.use("/api/posts", require("./api/posts"));
app.use("/api/auth", require("./api/auth"));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
