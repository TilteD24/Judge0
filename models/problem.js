const mongoose = require("mongoose");
const db = require("../db");

const problemSchema = new mongoose.Schema({
  pid: Number,
  description: String,
  title: String,
  test_cases: [
    {
      id: Number,
      parameters: Object,
      answer: Number,
    },
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
