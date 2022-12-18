const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.user;
const postData = data.post;
router.route("/").get(async (req, res) => {
  try {
    let userRegister = null;
    if (req.session.userId)
      userRegister = await userData.getUserById(req.session.userId);

    // let allPost = await postData.getAllPost();
    //   for (let i = 0; i < allPost.length; i++) {
    //     let temp = await userData.getUserById(allPost[i].userId);
    //     allPost[i].userNickname = temp.nickname;
    //   }
    // allPost.forEach(async (element) => {
    //   let userInfo = await userData.getUserById(element.userId);
    //   allPost.userName = userInfo.userName;
    // });
    // allPost.sort((a, b) => {
    //   b.date - a.date;
    // });
    // res.send({ allPost, userRegister });
    // res.status(200).json(allPost);
    res.render("mainPage/home.handlebars", { title: `First Page` });
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
router.route("/createPost").get(async (req, res) => {
  if (!req.session.user){
    return res.render("mainPage/home", { message: 'Must be login to create post'});
  }
  const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../', 'public', 'img');
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        try {//topic, userid, caption, images, tagsArray
            if (!fields)
                throw "need data to create post";
            if (!fields.topic)
                throw "need topic to create post "
            if (!fields.caption)
                throw "need caption to create post"
            if (!fields.tagsArray)
                throw "need a tagsArray String to create post";
            let tagsArray = JSON.parse(fields.tagsArray);
            if (!Array.isArray(tagsArray))
                throw "need a tagsArray to create post";
            let photoArr = [];

            if (files.photo0)
                photoArr.push("http://localhost:3000/public/img/" + files.photo0.path.split('img\\')[1]);
            if (files.photo1)
                photoArr.push("http://localhost:3000/public/img/" + files.photo1.path.split('img\\')[1]);
            if (files.photo2)
                photoArr.push("http://localhost:3000/public/img/" + files.photo2.path.split('img\\')[1]);
            
            let newPost = await postData.createPost(
                fields.topic,
                req.session.username,
                fields.caption,
                photoArr,
                tagsArray
            )
            res.send(newPost);
        } catch (error) {
            res.status(404).send(error);
        }
      })
     
  
  try {
    
  } catch (e) {
    if (e.code) res.status(e.code).json({ error: e.err });
    else res.status(400).json({ error: e });
  }
});
module.exports = router;
