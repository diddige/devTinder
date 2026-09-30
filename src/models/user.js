const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [5, "Minimum 5 characters"],
      maxLength: [50, "Maximum 50 characters"],
    },
    lastName: {
      type: String,
      minLength: [5, "Minimum 5 characters"],
      maxLength: [50, "Maximum 50 characters"],
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    photoUrl: {
      type: String,
      validate: (value) => {
        if (validator.isUrl(value)) {
          throw new Error("Please enter valid url");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age should be greater or equal to 18"],
    },
    about: {
      type: String,
      maxLength: [50, "Maximum 50 characters"],
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Skills cannot be more than 5",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: '"{VALUE}" is not allowed value',
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@123", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );

  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
