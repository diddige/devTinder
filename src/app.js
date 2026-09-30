const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { User } = require("./models/user");

const app = express();
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/request");
const { userRouter } = require("./routes/user");

const PORT = 3000;

connectDB()
  .then(() => {
    console.log("Database connection established successfully");
    app.listen(PORT, () => {
      console.log("Hello");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected !!!");
  });

// middleware for json
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter, profileRouter, requestRouter, userRouter);

//feed
app.get("/feed", async (req, res) => {
  try {
    const feed = await User.find().exec();
    if (!feed) {
      res.status(404).send("Database is empty");
    } else {
      res.send(feed);
    }
  } catch (error) {
    console.log(`Database failed to get feed - ERROR : ${error.message}`);
    res.send(`Internal Error, Please try again : ${error.message}`);
  }
});

app.use((req, res) => {
  res.send("Hello from server");
});

// handling error scenarios
app.use("/", (err, req, res, next) => {
  if (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
