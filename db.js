require("dotenv").config();

const { PASSWORD } = require("./config");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://Divyanshu:${PASSWORD}@cluster0.ciu4kfo.mongodb.net/judge0`
);
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
