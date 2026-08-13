const pool = require('../config/db');

const insertUser = async (username, email, passwordHash) => {
  const result = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
    [username, email, passwordHash]
  );
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};
const insertFollow = async (followerId, followingId) => {
  await pool.query(
    'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
    [followerId, followingId]
  );
};

const deleteFollow = async (followerId, followingId) => {
  await pool.query(
    'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
};
const getUserProfile = async (userId) => {
  const userResult = await pool.query(
    'SELECT id, username, email, created_at FROM users WHERE id = $1',
    [userId]
  );

  if (userResult.rows.length === 0) {
    return null;
  }

  const postsResult = await pool.query(
    'SELECT id, image_url, caption, created_at FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );

  return {
    user: userResult.rows[0],
    posts: postsResult.rows,
  };
};

const isFollowing = async (followerId, followingId) => {
  const result = await pool.query(
    'SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2',
    [followerId, followingId]
  );
  return result.rows.length > 0;
};
module.exports = { insertUser, findUserByEmail, insertFollow, deleteFollow, getUserProfile, isFollowing };