const userData = require('./user');
const postData = require('./post');
const commentData = require('./comment');
const reportData = require('./report');
const chatData = require('./chat');

module.exports = {
    user: userData,
    post: postData,
    comment: commentData,
    report: reportData,
    chat: chatData
};