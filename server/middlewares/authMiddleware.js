const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: "Access token not found" });
    }

    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);

    req.user = decodedToken;  // Attach the user data to the request

    next();  // Proceed to the next middleware or route handler

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Invalid access token" });
  }
};

module.exports = authMiddleware;
