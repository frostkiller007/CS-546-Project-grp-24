const express = require("express");
const router = express.Router();
// const data = require('../data');
// const userData = data.user;
const userData = require("../data/user.js");
//const postData = data.post;
const valid = require("../helper.js");

// const { async } = require("seed/lib/seed");

router.route("/").get(async (req, res) => {
  if (!req.session.user) {
    //TODO
  }
  res.redirect("/mainPage");
  //TODO: guest
  res.redirect("/mainPage");
});

router
  .route("/register")
  .get(async (req, res) => {
    if (!req.session.user) {
      //TODO
      return res.render("mainPage/register");
    }
    res.redirect("/mainPage");
  })
  .post(async (req, res) => {
    const usersData = req.body;
    //TODO: validation
    try {
      const newUser = await userData.createUser(
        usersData.username,
        usersData.email,
        usersData.age,
        usersData.city,
        usersData.state,
        //usersData.postID,
        usersData.password
      );
      // if(newUser){
      //   res.status(200).render('mainPage/login',{title:'Login'});
      // }else{
      //   res.status(400).render('mainPage/login', {errors: errors,hasErrors: true,title:'Login',
      // errorMessage:'There is already a user with the username! Try to login.'});
      // }
      // return res.render("mainPage/login");
      if (newUser.insertedUser) res.render("mainPage/login");
    } catch (e) {
      return res
        .status(500)
        .render("mainPage/register", { error: "Internal Server Error" });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/mainPage");
    }

    res.render("mainPage/login");
  })
  .post(async (req, res) => {
    let usersData = req.body;
    email = valid.checkEmail(usersData.email);
    password = valid.checkPassword(usersData.password);
    let usernameDB = await userData.getUserByEmail(email);
    try {
      const loginUser = await userData.verifyUser(
        usersData.email,
        usersData.password
      );
      if (loginUser) {
        req.session.AuthCookie = usersData.email;
        req.session.user = { email: usersData.email, username: usernameDB };
        req.session.login = loginUser.authenticatedUser;
        res.redirect("/mainPage");
      } else {
        return res.status(401).render("mainPage/login", {
          error: "Provide a valid username and/or password",
        });
      }
    } catch (e) {
      return res.status(401).render("mainPage/login", {
        error: "Provide a valid username and/or password",
      });
    }
  });
router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/mainPage");
  }
  req.session.destroy();
  return res.redirect("/mainPage");
});

router
  .route("/profile")
  .get(async (req, res) => {
    let usersData = req.body;
    console.log(req.session);
    if (req.session.user) {
      try {
        const userID = await userData.getUserById(usersData.user);
        //const userPosts = await postData.getPostById(userID);
        //Get all post by user
      } catch (e) {
        //TODO
        res.status(404).json({ error: "Invalid user" });
      }}
    else{
      return res.redirect("/mainPage");
    }
  })
  .post(async (req, res) => {
    let usersData = req.body;
    const user_ = req.session.user;
    console.log(req.session)
    let userExists;
    try{
      userExists = await userData.getUserById(user_);
    }catch(e){
      //TODO
      res.status(404).json({error: 'User not found'});
    }
    try{
      if(username){
        if(usersData.username == userExists.username) throw "Error: Updated username must be differnt from previous";
        const updatedInfo = await userData.updateUsername(usersData.username, usersData.userID);
        if(updatedInfo){
          return res.render("profilePage/profile");
        }
      
      }
    }catch(e){
    }
  })
module.exports = router;
