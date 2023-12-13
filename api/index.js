const express = require("express");
const app = express();
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const User = require("./models/user");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://jannylynemiaz:s1kKMGLLnjgl1EIV@cluster0.zpvtryi.mongodb.net/?retryWrites=true&w=majority"
);
app.post("/register", async (req, res) => {
  // Create user
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({ username, password });
    res.json(userDoc);
  } catch (error) {
    res.status(400).json(error);
  }
});
app.listen(4000);
// p8EkIgxY3F5bDYIL
// s1kKMGLLnjgl1EIV
// mongodb+srv://jannylynemiaz:s1kKMGLLnjgl1EIV@cluster0.zpvtryi.mongodb.net/?retryWrites=true&w=majority
