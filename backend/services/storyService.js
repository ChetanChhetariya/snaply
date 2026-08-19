const storyModel = require('../models/storyModel');

const createStory = async (userId, imageUrl) => {
  return await storyModel.insertStory(userId, imageUrl);
};

const getStories = async () => {
  return await storyModel.getActiveStories();
};

module.exports = { createStory, getStories };