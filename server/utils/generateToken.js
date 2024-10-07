const jwt = require("jsonwebtoken");

const generateToken = async ({ userId, res }) => {
  const accessToken = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  const refreshToken = jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  return { accessToken, refreshToken };
};

module.exports =  generateToken ;
