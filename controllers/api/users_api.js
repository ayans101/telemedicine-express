const User = require("../../models/user");
const env = require("../../config/environment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Log = require("../../models/log");

module.exports.login = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    let isPasswordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!user || !isPasswordMatched) {
      return res.status(422).json({
        message: "Invalid username or password",
        success: false,
      });
    }

    let log = new Log({
      type: "User",
      user: user,
      description: "User Logged In",
    });
    await log.save();

    return res.status(200).json({
      message: "Sign in successful, here is your token, please keep it safe",
      success: true,
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1d" }),
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.register = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(422).json({
        message:
          "There already exists an account registered with this email address",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
    await User.create(req.body, async function (err, user) {
      let log = new Log({
        type: "User",
        user: user,
        description: "User Registered",
      });
      await log.save();

      return res.status(200).json({
        message: "Sign up successful, here is your token, please keep it safe",
        success: true,
        data: {
          token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1d" }),
          user: {
            email: user.email,
            userType: user.userType,
            name: user.name,
            age: user.age,
            phoneNumber: user.phoneNumber,
            _id: user._id,
          },
        },
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    } else {
      return res.status(200).json({
        message: "User Details",
        success: true,
        data: {
          user: {
            email: user.email,
            userType: user.userType,
            name: user.name,
            age: user.age,
            phoneNumber: user.phoneNumber,
            _id: user._id,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

module.exports.getAllDoctors = async function (req, res) {
  try {
    let doctors = await User.find({ userType: "Doctor" }).select("name");
    return res.status(200).json({
      message: "Doctor details Retrieved",
      success: true,
      data: {
        doctors: doctors,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
