const express = require("express");
const router = express.Router();
// router.route("/").get(async (req, res) => {});



// CHECK FOR ERRORS

router.route("/").get(async (req, res) => {
  try{
  let userRegister = null;
    if (!req.session.user)
      userRegister = await userData.getUserById(req.session.user);
      res.render("reports/usernotFound");
  }catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
router.post("/form" ,async(req, res) => {
  
    try
    {
      const userId = req.session.user;
      if(!req.session.user){
        return res.status(400).render("error",{error:'error'});
      }
      else{
   
      const post = await postData.getPostById(postId);
      
        let reason = req.body.reason;
        if(typeof reason == "string")
        {
          reason=[reason];
        }
        await reportData.addReport(userId,postId,reason);
        res.render('reports/form',{success:"Report successfully submitted!", userLogin,'reported-post':post.topic, 'postId': postId});
        return;
    }}
    catch(e)
    {
      res.render('reports/form',{message:e, userLogin,'reported-post':post.topic, 'postId': postId});
    } 
});

module.exports = router;
