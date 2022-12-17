const express = require("express");
const router = express.Router();
router.route("/").get(async (req, res) => {});

router.route("/").get(async (req, res) => {
  try{
  let userRegister = null;
    if (req.session.userId)
      userRegister = await userData.getUserById(req.session.userId);
      res.render("reports/usernotFound")
  }catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
module.exports = router;
