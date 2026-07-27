const pool = require('../config/db');

const insertPost = async (userId, imageUrl, caption) => {
  const result = await pool.query(
    'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
    [userId, imageUrl, caption]
  );
  return result.rows[0];
};

const getAllPosts = async () => {
  const result = await pool.query(
    `SELECT posts.id, posts.image_url, posts.caption, posts.created_at,
            users.id AS user_id, users.username
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`
  );
  return result.rows;
};

const insertLike = async (postId, userId) => {
  await pool.query('INSERT INTO likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
};

const deleteLike = async (postId, userId) => {
  await pool.query('DELETE FROM likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
};

module.exports = { insertPost, getAllPosts, insertLike, deleteLike };