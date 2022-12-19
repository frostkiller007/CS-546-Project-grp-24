const express = require("express");
const router = express.Router();
const userData = require("../data/user.js");
const postData = require("../data/post.js");

const valid = require("../helper.js");
const bcrypt = require("bcrypt");
const xss = require("xss");
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
      let userLogin = req.session.user;
      return res.render("mainPage/register", { title: "Sign Up Page" });
    }
    res.redirect("/mainPage");
  })
  .post(async (req, res) => {
    // const usersData = req.body;
    // validation
    try {
      username = xss(req.body.username);
      email = xss(req.body.email);
      age = xss(req.body.age);
      city = xss(req.body.city);
      //state = xss(req.body.state);
      //postID = xss(req.body.postID);
      password = xss(req.body.password);
      password2 = xss(req.body.password2);

      username = valid.checkUserName(username);
      email = valid.checkEmail(email);
      age = valid.checkAge(age);
      city = valid.checkString(city);
      password = valid.checkPassword(password);
      if (password !== password2) throw "Both entered password must be same";
      let usernameDB = await userData.getUserByEmail(email);
      const newUser = await userData.createUser(
        username,
        email,
        age,
        city,
        state,
        postID,
        password
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
      return res.status(500).render("mainPage/register", { error: e });
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      let userLogin = true;
      return res.redirect("/mainPage");
    }

    res.render("mainPage/login");
  })
  .post(async (req, res) => {
    try {
      let usersData = req.body;
      let email = xss(req.body.email);
      let password = xss(req.body.password);
      email = valid.checkEmail(usersData.email);
      password = valid.checkPassword(password);
      let usernameDB = await userData.getUserByEmail(email);
      const loginUser = await userData.verifyUser(
        usersData.email,
        usersData.password
      );
      let admin =
        usersData.email.toLowerCase() ===
        "Admin214@gmail.com".toLocaleLowerCase();

      if (loginUser) {
        req.session.AuthCookie = usersData.email;
        req.session.user = {
          email: usersData.email,
          username: usernameDB,
          id: loginUser.id,
          isAdmin: admin,
        };
        req.session.login = loginUser.authenticatedUser;
        let allPost = await postData.getAllPosts();

        for (let i = 0; i < allPost.length; i++) {
          let userInfo = await userData.getUserByUserId(allPost[i].userId);
          allPost[i].username = userInfo.username;
        }
        return res.render("mainPage/home", {
          userLogin: req.session.login,
          isAdmin: admin,
          title: "Handouts Logged in User",
          allPost,
        });
      }
    } catch (e) {
      return res.status(401).render("mainPage/login", {
        error: e,
      });
    }
  });
router.route("/logout").get(async (req, res) => {
  if (req.session.user) {
    // return res.redirect("/mainPage");
    req.session.destroy();
    return res.redirect("/mainPage");
  }
});

router
  .route("/profile")
  .get(async (req, res) => {
    const usersData = req.session.user;
    console.log(req.session);
    if (req.session.user) {
      try {
        const user = await userData.getUserByUsername(usersData.username);
        //const userPosts = await postData.getPostById(userID);
        //Get all post by user
        // console.log(user);
        return res.render("profilePage/profile", {
          username: user.username,
          email: user.email,
          age: user.age,
          city: user.city,
          state: user.state,
          userLogin: req.session.login,
          isAdmin: req.session.user.isAdmin,
          profilePicture: req.session.user.profilePicture,
        });
      } catch (e) {
        //TODO
        res.status(404).json({ error: "Invalid user" });
      }
    } else {
      return res.redirect("/mainPage");
    }
  })
  .post(async (req, res) => {
    let usersData = req.body;
    const username = req.session.user.username;

    let userExists;
    try {
      userExists = await userData.getUserByUsername(username);
    } catch (e) {
      //TODO
      res.status(404).json({ error: "User not found" });
    }
    try {
      if (usersData.username) {
        if (usersData.username == userExists.username)
          throw "Error: Updated username must be differnt from previous";
        const updatedInfo = await userData.updateUsername(
          usersData.username,
          userExists._id
        );
        if (updatedInfo) {
          return res.render("profilePage/profile");
        }
      } else if (usersData.state) {
        if (usersData.state == userExists.state)
          throw "Error: Updated state must be differnt from previous";
        const updatedInfo = await userData.updateState(
          usersData.state,
          userExists._id
        );
        if (updatedInfo) {
          return res.render("profilePage/profile");
        }
      } else if (usersData.city) {
        if (usersData.city == userExists.city)
          throw "Error: Updated city must be differnt from previous";
        const updatedInfo = await userData.updateCity(
          usersData.city,
          userExists._id
        );
        if (updatedInfo) {
          return res.render("profilePage/profile");
        }
      } else if (usersData.password) {
        //if(usersData.password !== usersData.confirmPassword) throw "Error: Both passwords should match";
        hashedPassword = await bcrypt.hash(usersData.password, saltRounds);

        const updatedInfo = await userData.updatePassword(
          hashedPassword,
          userExists._id
        );
        if (updatedInfo) {
          return res.render("profilePage/profile");
        }
      }
    } catch (e) {
      res.status(400).json({ err: e });
    }
  }),
  router.route("/profile/update").patch(async (req, res) => {
    // hajd;
    // if
  });
router.route("/viewProfile/:id").get(async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/mainPage");
    } else {
    }
  } catch (e) {
    res.status(400).json({ err: e });
  }
});
//   .post(async (req, res) => {
//     try {
// 	if (!req.session.user) {
// 	      return res.redirect("/mainPage");
// 	    } else {
// 	    }
// } catch (e) {
//   res.status(400).json({err:e})

// }
//   });
module.exports = router;
