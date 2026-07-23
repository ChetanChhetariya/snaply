const pool = require('../config/db');

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const image_url = `/uploads/${req.file.filename}`;

    const result = await pool.query(
      'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [userId, image_url, caption]
    );

    res.status(201).json({ message: 'Post created successfully', post: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const getFeed = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.id, posts.image_url, posts.caption, posts.created_at,
              users.id AS user_id, users.username
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );

    res.status(200).json({ posts: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};
const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    await pool.query(
      'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
      [postId, userId]
    );

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
    const userId = req.user.userId;
    const { postId } = req.params;

    await pool.query(
      'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    res.status(200).json({ message: 'Post unliked' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports = { createPost, getFeed, likePost, unlikePost };