const jwt = require("jsonwebtoken");

const generateToken = async ({userId, res}) => {
  const token = jwt.sign(
    {
      userId
    },
    process.env.JWT_SECRET,
    { expiresIn: "15d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return token;
};

module.exports = { generateToken };
