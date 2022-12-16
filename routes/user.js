const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const postData = data.post;
const valid = require("../helper.js");
// const { async } = require("seed/lib/seed");

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    //TODO
  }
  res.redirect("/mainPage");
  //TODO: guest
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      //TODO
      return res.redirect("/homepage");
    }
    res.render("homepage/register");
  })
  .post(async (req, res) => {
    const usersData = req.body;
    //TODO: validation
    try {
      const newUser = await usersData.createUser(
        usersData.username,
        usersData.email,
        usersData.age,
        usersData.city,
        usersData.state,
        usersData.postID,
        usersData.password,
        usersData.profilePicture
      );
      // if(newUser){
      //   res.status(200).render('userLogin',{title:'Login'});
      // }else{
      //   res.status(400).render('userLogin', {errors: errors,hasErrors: true,title:'Login',
      // errorMessage:'There is already a user with the username! Try to login.'});
      // }
      return res.render("homepage/login");
    } catch (e) {
      return res
        .status(500)
        .render("homepage/register", { error: "Internal Server Error" });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/homepage");
    }

    res.render("homepage/login");
  })
  .post(async (req, res) => {
    let usersData = req.body;
    if (req.session.user) {
      return res.redirect("/homepage");
    }
    username = valid.checkUserName(usersData.username);
    password = valid.checkPassword(usersData.password);
    try {
      const loginUser = await usersData.checkUser(
        usersData.usernameInput,
        usersData.passwordInput
      );
      if (loginUser) {
        req.session.AuthCookie = userData.usernameInput;
        req.session.user = { Username: userData.usernameInput };
        res.redirect("/homepage");
      } else {
        return res.status(401).render("homepage/login", {
          error: "Provide a valid username and/or password",
        });
      }
    } catch (e) {
      return res.status(401).render("homepage/login", {
        error: "Provide a valid username and/or password",
      });
    }
  });
router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/homepage");
  }
  req.session.destroy();
  return res.redirect("/homepage");
});

router
  .route("/profile")
  .get(async (req, res) => {
    let usersData = req.body;
    if (req.session.user) {
      return res.redirect("/homepage");
    }
    try {
      const userID = await userData.getUserById(usersData.user);
      const userPosts = await postData.getPostById(userID);
      //Get all post by user
    } catch (e) {
      res.status(404).json({ error: "Invalid user" });
    }
  })
  .post(async (req, res) => {});

module.exports = router;
