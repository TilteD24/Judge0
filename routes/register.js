const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const user = {
      user_name: req.body.username,
      email_id: req.body.email,
      password: req.body.password,
    };

    const addUser = await userModel.create(user);

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.status(201).json({ accessToken: accessToken });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
