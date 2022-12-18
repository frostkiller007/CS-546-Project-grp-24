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
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

router.route("/").get(async (req, res) => {
  try {
    let userRegister = null;
    if (req.session.user)
      userRegister = await userData.getUserByUserId(req.session.user.id);

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

    res.render("mainPage/home", { title: "Home Page", allPost });
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
router.post("/createPost", upload.single("picture"), async (req, res) => {
  if (!req.session.user) {
    return res.render("mainPage/home", {
      message: "Must be login to create post",
    });
  }
  const description = req.body.description;
  const tagsArray = req.body.tag;
  var img = fs.readFileSync(
    path.join(__dirname, "../", "public/img", req.body.picture)
  );
  var encode_image = img.toString("base64");
  let username = req.session.user.username;
  var finalImg = {
    contentType: "image/jpg",
    image: Buffer.from(encode_image, "base64"),
  };

  const addPost = await postData.AddPost(
    //"topic",
    username,
    description,
    finalImg,
    tagsArray
  );
  return res.render("mainPage/home");

  //https://www.geeksforgeeks.org/how-to-upload-file-using-formidable-module-in-node-js/
});

module.exports = router;
