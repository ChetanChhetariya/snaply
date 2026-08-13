const postService = require('../services/postService');

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const post = await postService.createPost(userId, imageUrl, caption);

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const getFeed = async (req, res) => {
  try {
    const posts = await postService.getFeed(req.user.userId);
    res.status(200).json({ posts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const likePost = async (req, res) => {
  try {
    await postService.likePost(req.params.postId, req.user.userId);
    res.status(201).json({ message: 'Post liked' });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'You already liked this post' });
    }
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const unlikePost = async (req, res) => {
  try {
    await postService.unlikePost(req.params.postId, req.user.userId);
    res.status(200).json({ message: 'Post unliked' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const comment = await postService.addComment(req.params.postId, req.user.userId, text);
    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await postService.getComments(req.params.postId);
    res.status(200).json({ comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};
module.exports = { createPost, getFeed, likePost, unlikePost, addComment, getComments };