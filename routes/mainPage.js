const mainPageData = data.mainPage;

router
  .route("/")
  .get(async (req, res) => {
    try {
      let userRegister = null;
      if (req.session.userId)
        userRegister = await userData.getUserById(req.session.userId);

      let allPost = await postData.getAllPost();
      //   for (let i = 0; i < allPost.length; i++) {
      //     let temp = await userData.getUserById(allPost[i].userId);
      //     allPost[i].userNickname = temp.nickname;
      //   }
      allPost.forEach(async (element) => {
        let userInfo = await userData.getUserById(element.userId);
        allPost.userName = userInfo.userName;
      });
      allPost.sort((a, b) => {
        b.date - a.date;
      });
      // res.send({ allPost, userRegister });
      res.status(200).json(allPost);
      //   res.render("mainPage/home.handlebars", { allPost, userRegister });
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  })
  .route("/tags")
  .get(async (req, res) => {
    try {
      let userRegister = null;
      if (req.session.userId)
        userRegister = await userData.getUserById(req.session.userId);
      if (!req.query.tag)
        throw { code: 404, err: `Please select atleast one tag` };

      let tagPost = await postData.getPostByTag(req.query.searchTag);
      res.status(200).json(tagPost);
      //   res.render("mainPage/home.handlebars", { tagPost, userRegister });
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  })
  .route("/search")
  .get(async (req, res) => {
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
      //   res.render("mainPage/home.handlebars", { allPost, searchStringPost });
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  })
  .route("/createPost")
  .get(async (req, res) => {
    try {
    } catch (e) {
      if (e.code) res.status(e.code).json({ error: e.err });
      else res.status(400).json({ error: e });
    }
  });
