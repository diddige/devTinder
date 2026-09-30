const validator = require('validator');

const validateSignUpData = (data) => {
    const { emailId, password, firstName, lastName} = data;

    if(!firstName || !lastName){
        throw new Error("Enter first name or last name.")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong")
    }
}

const validateLoginData = (data) => {
    const { emailId } = data;

    if(!validator.isEmail(emailId)){
        throw new Error("Invalid Credentials");
    }
}

const validateEditProfileData = (data) => {
    const allowedFileds = ["firstName", "lastName", "photoUrl", "age", "about", "skills", "gender"];
    const isEditAllowed = Object.keys(data).every(key => allowedFileds.includes(key));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateLoginData,
    validateEditProfileData
}