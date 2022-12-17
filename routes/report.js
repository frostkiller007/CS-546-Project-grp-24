const express = require("express");
const router = express.Router();
router.route("/").get(async (req, res) => {});


router.get("/form" , async (req, res) => {
    if (!req.session.userId) {   
      return res.redirect('/homePage');
    }
    try{
      const ID = req.session.userId;
      const login = await userData.getUserById(ID);
      const postId = req.query.id;
      const post = await postData.getPostById(postId);
      res.render('reports/report-form',{login,'reported-post':post.topic, 'postId': postId});
    }catch(e){
      res.status(404).json({ error: e });
    }
  });
  router.post("/form", async (req, res) => {
    const Id = req.session.userId;
    const login = await userData.getUserById(Id);
    const postId=req.body.postId;
    const post = await postData.getPostById(postId);
      try
      {
          let reason = req.body.reason;
          if(typeof reason == "string")
          {
            reason=[reason];
          }
          await reportData.addReport(Id,postId,reason);
          res.render('reports/report-form',{success:"Report successfully submitted!", login,'reported-post':post.topic, 'postId': postId});
          return;
      }
      catch(e)
      {
        res.render('reports/report-form',{message:e, login,'reported-post':post.topic, 'postId': postId});
      } 
  });
  
  router.get('/statistic', async (req, res) => {
    if (req.session && req.session.userId) {
      let login = await userData.getUserById(req.session.userId)
      if (login.Admin) {
        try {
          let allPosts = await postData.getAllPost();
          let allUsers = await userData.getAllUsers();
          let allComments = await commentData.getAllComments();
          res.render('statistics/statistics',{ allPosts,allUsers, allComments,login });
        } catch (error) {
          res.status(404).send(error);
        }
      }
      else
        res.redirect('/homePage');
    }
    else
      res.redirect('/homePage');
  })
  
  router.get("/:id", async (req, res) => {
      try {
        const report = await reportData.getReport(req.params.id);
        res.status(200).json(report);
      } catch (e) {
        res.status(404).json({ message: "Report not found" });
      }
    });
  
  router.get("/", async (req, res) => {
    if (req.session && req.session.userId) {
      let login = await userData.getUserById(req.session.userId);
      if (login.Admin) {
        const r_list= await reportData.getAllReports();
        try {
          res.render('reports/r_list',{r_list,login});
        } catch (error) {
          res.status(404).send(error);
        }
      }
      else
        res.redirect('/homePage');
    }
    else
      res.redirect('/homePage');
  });
  
