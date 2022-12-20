const express = require("express");
const router = express.Router();
const xss = require("xss");
const reportData = require('../data/report');
const postData = require('../data/post');
const { response } = require("express");


// CHECK FOR ERRORS

router.route("/:id/reporting").get(async (req, res) => {
  try {
    let userRegister = null;
    if (req.session.user) {
      res.render("mainPage/reports", { login: req.session.login });
      req.session.reportId = xss(req.params.id);
      console.log(req.session.reportId);
    }

  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
router.route("/form").post(async (req, res) => {
  try {
    const userId = req.session.user.id;
    console.log(userId+"uid")
    const postId = req.session.reportId;
    console.log(postId+"pid")
    if (!req.session.user) {
      return res.status(400).render("error", { error: "error" });
    } else {
      const post = await postData.getPostByID(postId.toString());
      
        let reason = xss(req.body.reason);
        console.log(reason);
        let reasonArr=[];
        if(typeof reason == "string")
        {
          reasonArr.push(reason);
        }
        console.log(reasonArr+"arr")
        const result = await reportData.AddReport(userId.toString(),postId.toString(),reasonArr);
        console.log(result);
        req.session.reportId=null;
        
        res.redirect("/mainPage");
        
    }}
    catch(e)
    {
      console.log(e);
    } 
});

module.exports = router;
