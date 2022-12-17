const express = require("express");
const router = express.Router();
const userData = require("../data/user.js");
const valid = require("../helper.js");
const bcrypt = require("bcrypt");
let saltRounds = 10;

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
    const usersData = req.session.user;
    if (req.session.user) {
      try {
        const user = await userData.getUserByUsername(usersData.username);
        //const userPosts = await postData.getPostById(userID);
        //Get all post by user
        return res.render('profilePage/test')
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
    const username = req.session.user.username;
    
    let userExists;
    try{
      userExists = await userData.getUserByUsername(username);
    }catch(e){
      //TODO
      res.status(404).json({error: 'User not found'});
    }
    try{
      if(usersData.username){
        if(usersData.username == userExists.username) throw "Error: Updated username must be differnt from previous";
        const updatedInfo = await userData.updateUsername(usersData.username, userExists._id);
        if(updatedInfo){
          return res.render("profilePage/profile");
        }
      }else if(usersData.state){
        if(usersData.state == userExists.state) throw "Error: Updated state must be differnt from previous";
        const updatedInfo = await userData.updateState(usersData.state, userExists._id);
        if(updatedInfo){
          return res.render("profilePage/profile");
        }
      }else if(usersData.city){
        if(usersData.city == userExists.city) throw "Error: Updated city must be differnt from previous";
        const updatedInfo = await userData.updateCity(usersData.city, userExists._id);
        if(updatedInfo){
          return res.render("profilePage/profile");
        }
      }else if(usersData.password){
        //if(usersData.password !== usersData.confirmPassword) throw "Error: Both passwords should match";
        hashedPassword = await bcrypt.hash(usersData.password, saltRounds);
        
        const updatedInfo = await userData.updatePassword(hashedPassword, userExists._id);
        if(updatedInfo){
          return res.render("profilePage/profile");
        }
      }
    }catch(e){
    }
  }),

router
  .route("/viewProfile")
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/mainPage");
    }
    else{

    }
  })
  .post(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/mainPage");
    }
    else{
      
    }
  })
module.exports = router;
