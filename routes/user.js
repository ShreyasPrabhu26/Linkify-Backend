const express = require("express");
const { handleUserSignUp, handUserLogin, checkAuthorization } = require("../controllers/user");

const router = express.Router();

router.post("/signup", handleUserSignUp)
router.post("/login", handUserLogin)

module.exports = router