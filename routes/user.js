const express = require("express");
const { handleUserSignUp, handUserLogin, checkAutherization } = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignUp)
router.post("/login", handUserLogin)
router.post("/checkAutherization", checkAutherization)

module.exports = router