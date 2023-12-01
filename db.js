const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/judge0");
const conn = mongoose.connection;
conn.on("connected", () => {
  console.log("Database is successfully connected");
});
conn.on("disconnected", () => {
  console.log("Database is successfully disconnected");
});
conn.on("error", () => {
  console.log("connection error");
});

module.exports = conn;
