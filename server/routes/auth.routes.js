const express = require("express");
const { userSignup, userLogin, userLogout, authMiddleware } = require("../controllers/auth.controllers");

const router = express.Router();

router.post("/signup",userSignup);
router.post("/login",userLogin);
router.post("/logout",userLogout);

router.get("/check-auth", authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      message: "Authenticated user!",
      user,
    });
  });

module.exports = router