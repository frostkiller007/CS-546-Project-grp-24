const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const helper = require("../helper");
const userData = require("./user");
const posts = mongoCollections.post;
const comments = mongoCollections.comment;

const AddPost = async (
  //topic,
  username,
  description,
  images,
  tagsArray
) => {
  // helper.contentcheck(topic);
  // helper.idcheck(userid);
  // helper.contentcheck(description);
  // helper.arraycheck(images);
  // helper.arraycheck(tagsArray);
  const getUser = await userData.getUserByUsername(username);
  const userId = getUser._id;
  const postCollection = await posts();
  let newPost = {
    //topic: topic,
    userId: ObjectId(userId),
    description: description,
    images: images,
    commentidArray: [],
    tagsArray: tagsArray,
    likes: 0,
    date: new Date().toLocaleDateString,
  };
  const insertInfo = await postCollection.insertOne(newPost);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add Post";
  const newPostId = insertInfo.insertedId;
  const postAdded = await getPostByID(newPostId);
  // userfunction name check(AddPosttoUser)
  await userData.addPostUser(userId, newPostId);
  return postAdded;
};

const DeletePost = async (postid) => {
  helper.idcheck(postid);
  const PostCollection = await posts();
  const deletionInfo = await PostCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw "Could not delete the Post";
  }
  return "Your Post has been successfully deleted!";
};

const EditPost = async (id, newcaption) => {
  helper.idcheck(id);
  helper.contentcheck(newcaption);
  const PostCollection = await posts();
  const editpost = {
    caption: newcaption,
  };
  const updatedInfo = await PostCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: editpost }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update post successfully";
  }

  return await getPostByID(id);
};

const getAllPosts = async () => {
  const PostCollection = await posts();
  const PostList = await PostCollection.find({}).toArray();
  return PostList;
};

const getPostByID = async (id) => {
  //helper.idcheck(id);
  const PostCollection = await posts();
  const post = await PostCollection.findOne({ _id: ObjectId(id) });
  if (post === null) throw "No post with that id";
  return post;
};

const getPostByString = async (string) => {
  helper.contentcheck(string);
  const PostCollection = await posts();
  let search = new RegExp(".*" + string + ".*", "i");
  const FindPost = await PostCollection.find({ topic: search }).toArray();
  if (FindPost === null) throw "No post found with that search";
  return FindPost;
};

const getPostByTag = async (tag) => {
  helper.contentcheck(tag);
  const PostCollection = await posts();
  const FindPost = await PostCollection.find({
    tagsArray: { $tagMatch: { $eq: tag } },
  }).toArray();
  if (FindPost === null) throw "No post found with that tag";
  return FindPost;
};

const getPostByManyTags = async (tags) => {
  helper.arraycheck(tags);
  const PostCollection = await posts();
  const FindPost = await PostCollection.find({
    tagsArray: { $all: tags },
  }).toArray();
  if (FindPost === null) throw "No post found with those tags";
  return FindPost;
};

const getLikeCount = async (postId) => {
  const postCollection = await posts();
  const glikeCount = await postCollection.findOne({ _id: ObjectId(postId) });
  const likeCount = glikeCount.likes;
  return likeCount;
};
const updatelikeCount = async (postId, userId, isLike) => {
  try {
    if (!postId) throw "Error: You must have postId";
    if (!userId) throw "Error: You must have userId";
    if (typeof postId !== "string" || typeof userId !== "string")
      throw "Error: You must have userId and postId of type string";
    if (!ObjectId.isValid(userId))
      throw "Error: The provided userID not a valid objectID";
    if (!ObjectId.isValid(postId))
      throw "Error: The provided postId not a valid objectID";
    const postCollection = await posts();
    let likeCount = await getLikeCount(postId);

    if (isLike) {
      likeCount++;
      await postCollection.updateOne(
        { _id: ObjectId(postId) },
        { $set: { likes: likeCount } }
      );
      //await postCollection.updateOne({_id: objReviewId},{$pull: {dislikes: userId}});
      return true;
    }
  } catch (e) {}
};

const getArrayofCommentIds = async (id) => {
  const thispost = await getPostByID(id);
  const commentidArray = thispost.comments;
  return commentidArray;
};

const AddCommenttoPost = async (postid, commentid) => {
  helper.idcheck(postid);
  helper.idcheck(commentid);
  const PostCollection = await posts();
  const FindPost = await getPostByID(postid);
  FindPost.commentidArray.push(commentid);
  const updatedInfo = await PostCollection.updateOne(
    { _id: ObjectId(postid) },
    { $set: { commentidArray: FindPost.commentidArray } }
  );
  if (updatedInfo.modifiedCount == 0) {
    throw "Error : could not update";
  }
  return true;
};

const DeleteCommentfromPost = async (postid, commentid) => {
  helper.idcheck(postid);
  helper.idcheck(commentid);
  const PostCollection = await posts();
  const FindPost = await getPostByID(postid);
  const commArr = [];
  for (i = 0; i < FindPost.commentidArray.length; i++) {
    if (FindPost.commentidArray[i] !== commentid)
      commArr.push(FindPost.commentidArray[i]);
  }
  FindPost.commentidArray = commArr;
  const updatedInfo = await PostCollection.updateOne(
    { _id: ObjectId(postid) },
    { $set: { commentidArray: FindPost.commentidArray } }
  );
  if (updatedInfo.modifiedCount == 0) {
    throw "Error : could not update";
  }
  return true;
};

const DeleteAllCommentsfromPost = async (postid) => {
  helper.idcheck(postid);
  const CommentCollection = await comments();
  const deletionInfo = await CommentCollection.delete({
    _id: ObjectId(postid),
  });
  if (deletionInfo.deletedCount === 0) {
    throw "Could not delete the comments";
  }
  return true;
};

module.exports = {
  AddPost,
  DeletePost,
  EditPost,
  getAllPosts,
  getPostByID,
  getPostByString,
  getPostByTag,
  getPostByManyTags,
  updatelikeCount,
  getLikeCount,
  AddCommenttoPost,
  DeleteCommentfromPost,
  DeleteAllCommentsfromPost,
  getArrayofCommentIds,
};
