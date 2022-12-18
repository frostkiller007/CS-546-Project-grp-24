const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helper");
const postData = data.post;

router
  .route("/likes")
  .get(async (req, res) => {
    try{
        if (!req.session.user) throw 'Error: You must be registered to like';
        if(!req.query.postId) throw 'Error: You must have post to like';
        
    const likePost = await postData.updatelikeCount(req.postId, userId, isLike);
    }catch(e){

    }

  });
module.exports = router;
