const express = require("express");
const router = express.Router();
const problemModel = require("../models/problem");

router.get("/", async (req, res) => {
  try {
    const problems = await problemModel.find({});
    //console.log(problems);
    res.status(201).json(problems);
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});

module.exports = router;
