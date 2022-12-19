const express = require("express");
const router = express.Router();
//const data = require("../data");
const userData = require("../data/user.js");
const postData = require("../data/post.js");
const path = require("path");
const multer = require("multer");
const xss = require("xss");

var fs = require("fs");
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(" ").join("-"));
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      let error = "Error";
      return error;
    }
  },
});

router.route("/").get(async (req, res) => {
  try {
    if (req.session.user) {
      userRegister = await userData.getUserByUserId(req.session.user.id);
    }

    let allPost = await postData.getAllPosts();

    for (let i = 0; i < allPost.length; i++) {
      let userInfo = await userData.getUserByUserId(allPost[i].userId);
      allPost[i].username = userInfo.username;
    }
    // allPost.forEach(async (element) => {
    //   let userInfo = await userData.getUserByUserId(element.userId);
    //   allPost.userName = userInfo.userName;
    // });
    // allPost.sort((a, b) => {
    //   b.date - a.date;
    // });
    // res.send({ allPost, userRegister });
    // res.status(200).json(allPost);

    res.render("mainPage/home", { title: "Handout home", allPost });
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
router.route("/tags").get(async (req, res) => {
  try {
    let userRegister = null;
    if (req.session.userId)
      userRegister = await userData.getUserById(req.session.userId);
    if (!req.query.tag)
      throw { code: 404, err: `Please select atleast one tag` };

    let tagPost = await postData.getPostByTag(req.query.searchTag);
    res.status(200).json(tagPost);
    //   res.render("mainPage/home.handlebars", { tagPost, userRegister });
    res.render("mainPage/home.handlebars", { title: `First Page` });
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
router.route("/search").get(async (req, res) => {
  try {
    let userRegister = null;
    if (req.session.userId)
      userRegister = await userData.getUserById(req.session.userId);
    if (!req.query.searchString)
      throw { code: 404, err: `Please input valid searchString` };

    let searchStringPost = await postData.getPostByString(
      req.query.searchString
    );
    res.status(200).json(searchStringPost);
    res.render("mainPage/home.handlebars", { title: `First Page` });

    //   res.render("mainPage/home.handlebars", { allPost, searchStringPost });
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
router.post(
  "/createPost",
  (result = upload.single("picture")),
  async (req, res) => {
    try {
      if (!req.session.user) {
        return res.render("mainPage/home", {
          message: "Must be login to create post",
        });
      }
      if (result === "Error") {
        throw "Only .png, .jpg and .jpeg format allowed!";
      }
      profilePicture = req.file.originalname;
      const updateProfilePicture = await updatePicture.updatePicture(
        req.session.user._id,
        profilePicture


        
      );
      req.session.user.profilePicture = profilePicture;
      return res.redirect("/mainPage");
    } catch (error) {
      console.log(error);
      res.status(401).redirect("/mainPage");
      return;
    }
    // const description = req.body.description;
    // const tagsArray = req.body.tag;
    // console.log(path.join(__dirname, "../", "public/img", req.body.picture));
    // var img = fs.readFileSync(
    //   path.join(__dirname, "../", "public/img", req.body.picture)
    // );
    // var encode_image = img.toString("base64");
    // let username = req.session.user.username;
    // var finalImg = {
    //   image: Buffer.from(encode_image, "base64"),
    // };

    const addPost = await postData.AddPost(
      //"topic",
      username,
      description,
      finalImg,
      tagsArray
    );
    return res.render("mainPage/home");

    // https://www.geeksforgeeks.org/upload-file-using-multer/
  }
);

module.exports = router;
