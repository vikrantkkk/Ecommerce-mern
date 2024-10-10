const express = require("express");
const { userSignup, userLogin, userLogout, refreshToken, getProfile } = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup",userSignup);
router.post("/login",userLogin);
router.post("/logout",userLogout);
router.post("/refresh-token",refreshToken);
router.get("/get-profile",authMiddleware, getProfile);

// router.get("/check-auth", authMiddleware, (req, res) => {
//     const user = req.user;
//     res.status(200).json({
//       success: true,
//       message: "Authenticated user!",
//       user,
//     });
//   });

module.exports = router