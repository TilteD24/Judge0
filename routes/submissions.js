const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const submissionModel = require("../models/submission");
const jwt = require("jsonwebtoken");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const submissions = await submissionModel.find({
      email_id: req.user.email_id,
    });

    res.status(201).json({ submissions: submissions });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
