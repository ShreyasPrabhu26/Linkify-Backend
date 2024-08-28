const express = require("express");
const { handleUserSignUp, handUserLogin, checkAuthorization } = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignUp)
router.post("/login", handUserLogin)
router.post("/checkAuthorization", checkAuthorization)

module.exports = router