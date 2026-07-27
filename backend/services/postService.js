const postModel = require('../models/postModel');

const createPost = async (userId, imageUrl, caption) => {
  return await postModel.insertPost(userId, imageUrl, caption);
};

const getFeed = async () => {
  return await postModel.getAllPosts();
};

const likePost = async (postId, userId) => {
  await postModel.insertLike(postId, userId);
};

const unlikePost = async (postId, userId) => {
  await postModel.deleteLike(postId, userId);
};

module.exports = { createPost, getFeed, likePost, unlikePost };