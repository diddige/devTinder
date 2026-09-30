const express = require('express');
const authRouter = express.Router();

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignUpData, validateLoginData} = require("../utils/validation");

// signup api
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req.body);
    const { emailId, password, firstName, lastName} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        emailId,
        password : passwordHash
    });
    await user.save();
    res.send("Signup Successfull");
  } catch (error) {
    console.log(`Database update failed - ERROR : ${error.message}`);
    res.status(400).send(`Signup failed, Please try again: ${error.message}`);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
    try {
        validateLoginData(req.body);
        const {emailId, password} = req.body;
        const user = await User.findOne({"emailId" : emailId});
        if(!user){
            throw new Error("Invalid Credentials")
        }
        const isValidPassword = await user.validatePassword(password) ;

        if(isValidPassword) {
            const token = await user.getJWT();
            console.log(token);
            // Setting cookie
            res.cookie("token", token, {   httpOnly: true, maxAge: 8 * 24 * 60 * 60 * 1000});
            res.send("Login Successful");
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch (error) {
        res.status(400).send(`Login failed, Please try again: ${error.message}`);
    }
});

//logout api
authRouter.post("/logout", (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out successfully")
})

module.exports = {
    authRouter
}