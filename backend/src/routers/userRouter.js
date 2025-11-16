const express = require("express");
const router = express.Router();
const { authMe } = require("../controllers/userController");

router.get("/me",authMe);

module.exports = router;
