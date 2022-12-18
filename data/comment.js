const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const helper = require("../helper");
const posts = require("./post");
const comments = mongoCollections.comment;

const AddComment = async (userid, postid, comment) => {
  helper.idcheck(userid);
  helper.idcheck(postid);
  helper.contentcheck(comment);
  const CommentCollection = await comments();
  let newComment = {
    userid: userid,
    postId: postid,
    comment: comment,
    date: new Date().toLocaleDateString(),
  };
  const insertInfo = await CommentCollection.insertOne(newComment);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add Comment";
  const newCommentid = insertInfo.insertedId;
  const CommentAdded = await getCommentByID(newCommentid.toHexString());
  await posts.AddCommenttoPost(postid, newCommentid.toHexString());
  return CommentAdded;
};

const DeleteComment = async (postid, commentid) => {
  helper.idcheck(postid);
  helper.idcheck(commentid);
  await posts.DeleteCommentfromPost(postid, commentid);
  const CommentCollection = await comments();
  const deletionInfo = await CommentCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete the comment`;
  }
  return "Your Comment has been successfully deleted!";
};

const getAllComments = async () => {
  const CommentCollection = await comments();
  const CommentList = await CommentCollection.find({}).toArray();
  if (!CommentList) {
    throw "No comments found";
  }
  return CommentList;
};

const getCommentByID = async (id) => {
  helper.idcheck(id);
  const CommentCollection = await comments();
  const comment = await CommentCollection.findOne({ _id: ObjectId(id) });
  if (comment === null) throw "No comment with that id";
  return comment;
};

module.exports = {
  AddComment,
  DeleteComment,
  getAllComments,
  getCommentByID,
};
