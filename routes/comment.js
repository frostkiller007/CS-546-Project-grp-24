const express = require("express");
const router = express.Router();
const data = require("../data");
const helper = require("../helper");
const postData = data.post;
const commentData = require("../data/comment.js");
const xss = require("xss");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const CommentList = await commentData.getAllComments();
      res.json(CommentList);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    try {
      if (!req.session.user) {
        res.status(400).json("You must login to comment on posts");
      }
      if (!req.body) {
        res.status(400).json("You must enter data to add a comment");
      }
      let userid = xss(req.body.userid);
      let postid = xss(req.body.postid);
      let comment = xss(req.body.comment);
      // console.log(userid);
      helper.idcheck(userid);
      helper.idcheck(postid);
      helper.contentcheck(comment);
      const newComment = await commentData.AddComment(postid, userid, comment);
      res.status(200).json(newComment);
    } catch (e) {
      res.status(400).send(e);
    }
  });

router
  .route("/:id")
  .post(async (req, res) => {
    let id = req.params.id;
    let commt = req.body.comment;
    await data.comment.AddComment(req.session.user.id, id, commt)
    // try {
    //   req.params.id = helper.idcheck(req.params.id);
    // } catch (e) {
    //   res.status(400).send("Invalid id");
    // }
    // try {
    //   const commentDetails = await commentData.getCommentByID(req.params.id);
    //   res.json(commentDetails);
    // } catch (e) {
    //   res.status(404).json("Comment not found");
    // }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = helper.idcheck(req.params.id);
    } catch (e) {
      res.status(400).send("Invalid id");
    }
    try {
      await commentData.getCommentByID(req.params.id);
    } catch (e) {
      res.status(404).json("Comment not Found");
    }
    try {
      const del = await commentData.DeleteComment(req.params.id);
      res.status(200).send(del);
    } catch (e) {
      res.status(500).json(e);
    }
  });

module.exports = router;
