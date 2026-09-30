const express = require('express');
const profileRouter = express.Router();

const bcrypt = require('bcrypt');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation')

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (error) {
        res.status(400).send(`Please login again: ${error.message}`);
    }
})

profileRouter.patch("/profile/edit", userAuth , async(req, res) => {
    try {
        const isEditAllowed = validateEditProfileData(req.body);

        if(!isEditAllowed){
            throw new Error("Fields are not allowed to edit");
        }else{
            const loggedInUser = req.user;
            Object.keys(req.body).every(key => loggedInUser[key] = req.body[key]);
            await loggedInUser.save();
            res.send(`${loggedInUser.firstName}'s profile has been updated`);
        }
    } catch (error) {
        res.status(400).send(`Editing is not permitted : ${error.message}`)
    }
    
})

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const user = req.user;
        const isValidPassword = await user.validatePassword(oldPassword);
        if(!isValidPassword){
            throw new Error("Old password is in valid");
        } else{
            const passwordHash = await bcrypt.hash(newPassword, 10);
            Object.assign(user, { password : passwordHash});
            await user.save();
            res.send("Password updated Successfully");
        }
    } catch (error){
        res.status(400).send(`Error updating the password : ${error.message}`);
    }
})

// console.log(module);

module.exports = {
    profileRouter
}