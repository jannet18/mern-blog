const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const salt = bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://jannylynemiaz:s1kKMGLLnjgl1EIV@cluster0.zpvtryi.mongodb.net/?retryWrites=true&w=majority"
);
app.post("/register", async (req, res) => {
  // Create user
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});

// user login
app.post("/login"),
  async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username: username });
    const passok = bcrypt.compareSync(password, userDoc.password);
    if (passok) {
      // login
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.json(token);
      });
    } else {
      res.status(400).json("wrong credentials");
    }
    res.json(passok);
    console.log(userDoc);
  };
app.listen(5000);
