const postService = require('../services/postService');
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

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
const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own post' });
    }

    await pool.query('DELETE FROM likes WHERE post_id = $1', [postId]);
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    const imagePath = path.join(__dirname, '..', post.rows[0].image_url);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Failed to delete image file:', err.message);
    });

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};
module.exports = { createPost, getFeed, likePost, unlikePost, addComment, getComments, deletePost };