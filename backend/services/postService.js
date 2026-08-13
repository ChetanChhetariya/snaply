const postModel = require('../models/postModel');

const createPost = async (userId, imageUrl, caption) => {
  return await postModel.insertPost(userId, imageUrl, caption);
};

const getFeed = async (currentUserId) => {
  return await postModel.getAllPosts(currentUserId);
};

const likePost = async (postId, userId) => {
  await postModel.insertLike(postId, userId);
};

const unlikePost = async (postId, userId) => {
  await postModel.deleteLike(postId, userId);
};
const addComment = async (postId, userId, text) => {
  return await postModel.insertComment(postId, userId, text);
};

const getComments = async (postId) => {
  return await postModel.getCommentsForPost(postId);
};

module.exports = { createPost, getFeed, likePost, unlikePost, addComment, getComments };