const express = require("express");
const xss = require("xss");

const router = express.Router();
router.route("/").get(async (req, res) => {});
module.exports = router;
