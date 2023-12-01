const mongoose = require("mongoose");
const db = require("../db");

const submissionSchema = new mongoose.Schema({
  email_id: String,
  problem_title: String,
  lang: String,
  verdict: String,
});

module.exports = mongoose.model("Submission", submissionSchema);
