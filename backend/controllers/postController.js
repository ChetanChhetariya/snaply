const pool = require('../config/db');

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user.userId; // comes from authMiddleware

    if (!req.file) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const image_url = `/uploads/${req.file.filename}`;

    const newPost = await pool.query(
      'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [userId, image_url, caption]
    );

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost.rows[0],
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports = { createPost };