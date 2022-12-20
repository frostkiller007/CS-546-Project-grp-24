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
      return res.render("mainPage/register", { title: "Sign Up Page"});
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
      password = xss(req.body.password);
      password2 = xss(req.body.password2);

      username = valid.checkUserName(username).toLowerCase();
      email = valid.checkEmail(email).toLowerCase();
      age = valid.checkAge(age);
      city = valid.checkString(city).toLowerCase();
      password = valid.checkPassword(password);
      if(password !== password2) throw 'Both entered password must be same';
      //let usernameDB = await userData.getUserByEmail(email);
      const newUser = await userData.createUser(
        username,
        email,
        age,
        city,
        password,
        password2
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
      email = valid.checkEmail(usersData.email).toLowerCase();
      password = valid.checkPassword(password);
      let usernameDB = await userData.getUserByEmail(email);
      const loginUser = await userData.verifyUser(
        email,
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
        let userRegister = req.session.login;
        return res.render("mainPage/home", {
          userLogin: req.session.login,
          isAdmin: admin,
          title: "Handouts Logged in User",
          allPost, userRegister
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
        console.log
        return res.render("profilePage/profile", {
          username: user.username,
          email: user.email,
          age: user.age,
          city: user.city,
          state: user.state,userRegister: true,userLogin: req.session.login
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
    const userId = req.session.user.id;

    let userExists;
    try {
     // userExists = await userData.getUserByUsername(username);
     userExists = await userData.getUserByUserId(userId);
    } catch (e) {
      //TODO
      res.status(404).json({ error: "User not found" });
    }
    try {
      if (usersData.username) {
        if (usersData.userId == userExists._id)
          throw "Error: Updated username must be differnt from previous";
        usersData.username = usersData.username.toLowerCase();
        const updatedInfo = await userData.updateUsername(
          usersData.username,
          userExists._id
        );
        if (updatedInfo) {
          return res.redirect("/user/profile");
        }
      } else if (usersData.state) {
        if (usersData.state == userExists.state)
          throw "Error: Updated state must be differnt from previous";
        
        usersData.state = usersData.state.toLowerCase();

        const updatedInfo = await userData.updateState(
          usersData.state,
          userExists._id
        );
        if (updatedInfo) {
          return res.redirect("/user/profile");
        }
      } else if (usersData.email) {
        if (usersData.email == userExists.email)
          throw "Error: Updated email must be differnt from previous";
        
        usersData.email = usersData.email.toLowerCase();

        const updatedInfo = await userData.updateEmail(
          usersData.email,
          userExists._id
        );
        if (updatedInfo) {
          const user = await userData.getUserByUsername(usersData.username);
         return res.redirect("/user/profile");
        //   return res.render("profilePage/profile", {
        //   username: user.username,
        //   email: user.email,
        //   age: user.age,
        //   city: user.city,
        //   state: user.state, message: 'Email Updated'
        // });
        //  return res.render("profilePage/profile", {message: 'Email Updated'});
        }
      } else if (usersData.password) {
        let p =usersData.password; let pc =usersData.Cpassword;
        if(p != pc) throw "Error: Both passwords should match";
        hashedPassword = await bcrypt.hash(usersData.password, saltRounds);

        const updatedInfo = await userData.updatePassword(
          hashedPassword,
          userExists._id
        );
        if (updatedInfo) {
          return res.redirect("/user/profile");
        }
      }
    } catch (e) {
      return res.status(500).render("profilePage/profile", { error: e });
    }
  }),
  // router.route("/profile/update").patch(async (req, res) => {
  //   const userInfo = req.body;


  // });
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
