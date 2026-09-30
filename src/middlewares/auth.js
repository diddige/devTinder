const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

const userAuth = async (req, res, next) => {
    console.log("User is being validated");
    try {
      const { token } = req.cookies;
      if (!token) {
        throw new Error("Invalid Token");
      }
      const decodedMessage = jwt.verify(token, "DevTinder@123");
      const { _id } = decodedMessage;
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("User Not Found");
      } else {
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(400).send(`ERROR : ${error.message}`);
    }
}

module.exports = {
    userAuth
}