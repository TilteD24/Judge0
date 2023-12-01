require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const PORT = require("./config");
const problems = require("./routes/home");
const languages = require("./routes/submit");
const login = require("./routes/login");
const submission = require("./routes/submissions");
const register = require("./routes/register");
const app = express();
const cors = require("cors");

// const corsOptions = {
//   origin: "http://localhost:3000",
// };

app.use(express.json());
app.use(cors());
app.use("/", problems);
app.use("/submit", languages);
app.use("/login", login);
app.use("/submissions", submission);
app.use("/register", register);

app.listen(PORT, () => {
  console.log("Listening on port PORT : ", PORT);
});
