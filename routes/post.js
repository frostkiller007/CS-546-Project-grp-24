const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helper");
const postData = data.post;

router
.route("/");

module.exports = router;
