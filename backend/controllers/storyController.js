const storyService = require('../services/storyService');

const createStory = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const story = await storyService.createStory(userId, imageUrl);

    res.status(201).json({ message: 'Story created successfully', story });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const getStories = async (req, res) => {
  try {
    const stories = await storyService.getStories();
    res.status(200).json({ stories });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports = { createStory, getStories };