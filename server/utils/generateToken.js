const jwt = require("jsonwebtoken");

const generateToken = async ({ userId, res }) => {
  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000, //15m
  });
  const refreshToken = jwt.sign(
    {
      userId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 15 * 24 * 60 * 60 * 1000, //15d
  });

  return { accessToken, refreshToken };
};

module.exports =  generateToken ;
