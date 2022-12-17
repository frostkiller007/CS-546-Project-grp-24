const express = require('express');
const router = express.Router();
const data = require('../data');
const helper = require('../helper');
const postData = data.post;
const commentData = data.comment;

router
.route('/')
.get(async (req, res) => {
    try {
        const CommentList = await commentData.getAllComments();
        res.json(CommentList);
    } catch (error) {
        res.status(500).send();
    }   
})

.post (async (req, res) => {
    let commentDetails = req.body;
    if (!commentDetails){
        res.status(400).json("You must enter data to add a comment");
    }
    const {userid, postid, comment} = commentDetails;
    try {
        helper.idcheck(userid);
    } catch (error) {
        res.status(400).send('Invalid userid');
    }
    try {
        helper.idcheck(postid);
    } catch (error) {
        res.status(400).send('Invalid postid');
    }
    try {
        helper.contentcheck(comment);
    } catch (error) {
        res.status(400).send('Invalid comment');
    }
    try {
        const newComment = await commentData.AddComment(postid, userid, comment);
        res.status(200).json(newComment)
    } catch (error) {
        res.status(500).json(error)
    }
});



router
.route('/:id')
.get(async (req, res) => {
    try {
        req.params.id = helper.idcheck(req.params.id);
    } catch (error) {
        res.status(400).send('Invalid id');
    }
    try {
        const commentDetails = await commentData.getCommentByID(req.params.id);
        res.json(commentDetails);
    } catch (error) {
        res.status(404).json('Comment not found');
    }
})

.delete(async (req, res) => {
    try {
        req.params.id = helper.idcheck(req.params.id);
    } catch (error) {
        res.status(400).send('Invalid id');
    }
    try {
        await commentData.getCommentByID(req.params.id);
    } catch (error) {
        res.status(404).json('Comment not Found')
    }
    try {
        const del = await commentData.DeleteComment(req.params.id);
        res.status(200).send(del);
    } catch (error) {
        res.status(500).json(error)
    }
});

module.exports = router;
