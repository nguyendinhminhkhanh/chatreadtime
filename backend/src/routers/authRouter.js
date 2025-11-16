const express = require("express");
const router = express.Router();
const { signUp, signIn, signOut } = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", signOut);

module.exports = router;
