const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const redis = require("../lib/redis");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
exports.userSignup = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    console.log("🚀 ~ exports.userSignup= ~ name, password, email:", name, password, email)

    if (!(name && email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const getSalt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, getSalt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = await generateToken({
      userId: newUser._id,
      res,
    });

    redis.set(`refreshToken:${newUser._id}`, refreshToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateToken({
      userId: user._id,
      res,
    });

    redis.set(`refreshToken:${user._id}`, refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userLogout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not found" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (decoded && decoded.userId) {
      await redis.del(`refreshToken:${decoded.userId}`);
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;


    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token not found" });
    }
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const storedToken =await redis.get(`refreshToken:${decodedToken.userId}`);



    if (storedToken !== refreshToken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decodedToken.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({
      success: true,
      message: "refreshToken successfully refreshed",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
