const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

router
  .get("/", authenticateToken, async (req, res) => {
    try {
      const user = await userModel.find({
        email_id: req.user.email_id,
        password: req.user.password,
      });
      res.status(201).json({ username: user[0].user_name });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  })
  .post("/", async (req, res) => {
    const user = {
      email_id: req.body.email_id,
      password: req.body.password,
    };

    try {
      const payload = await userModel.find({
        email_id: user.email_id,
        password: user.password,
      });
      if (payload.length <= 0)
        res.status(401).json({ error: "User not found" });
      else {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.status(201).json({ accessToken: accessToken });
      }
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
