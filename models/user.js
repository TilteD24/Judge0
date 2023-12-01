const mongoose = require("mongoose");
const db = require("../db");

const userSchema = new mongoose.Schema({
  user_name: String,
  email_id: String,
  password: String,
});

module.exports = mongoose.model("User", userSchema);
