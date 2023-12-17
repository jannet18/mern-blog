const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const uploadMiddleware = multer({ dest: "./uploads" });
const salt = bcrypt.genSaltSync(10);
const secret = "abshldgaisfgiewufguiewgfu";

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(
  "mongodb+srv://test:gDE1v10dz2uZ5i7t@cluster0.a6flela.mongodb.net/?retryWrites=true&w=majority"
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
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username: username });
  const passok = bcrypt.compareSync(password, userDoc.password);
  if (passok) {
    // login
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json("wrong credentials");
  }
  // res.json(passok);
  // console.log(userDoc);
});

// profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
  // res.json(req.cookies);
});

// create
app.post("/post", uploadMiddleware.single("file"), (req, res) => {
  // const {} = req.body;
  res.json({ files: req.file });
  // res.json(req.files);
});

// logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
  console.log("logged out");
});
app.listen(4000);
