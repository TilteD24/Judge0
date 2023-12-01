const mongoose = require("mongoose");
const db = require("../db");

const languageSchema = new mongoose.Schema({
  name: String,
  template: String,
});

module.exports = mongoose.model("Language", languageSchema);
