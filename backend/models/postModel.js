const pool = require('../config/db');

const insertPost = async (userId, imageUrl, caption) => {
  const result = await pool.query(
    'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
    [userId, imageUrl, caption]
  );
  return result.rows[0];
};

 const getAllPosts = async (currentUserId) => {
  const result = await pool.query(
    `SELECT posts.id, posts.image_url, posts.caption, posts.created_at,
            users.id AS user_id, users.username,
            EXISTS (
              SELECT 1 FROM likes
              WHERE likes.post_id = posts.id AND likes.user_id = $1
            ) AS liked_by_me,
            EXISTS (
              SELECT 1 FROM follows
              WHERE follows.follower_id = $1 AND follows.following_id = users.id
            ) AS followed_by_me
     FROM posts
     JOIN users ON posts.user_id = users.id
     ORDER BY posts.created_at DESC`,
    [currentUserId]
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
const insertComment = async (postId, userId, text) => {
  const result = await pool.query(
    'INSERT INTO comments (post_id, user_id, text) VALUES ($1, $2, $3) RETURNING *',
    [postId, userId, text]
  );
  return result.rows[0];
};

const getCommentsForPost = async (postId) => {
  const result = await pool.query(
    `SELECT comments.id, comments.text, comments.created_at, users.username
     FROM comments
     JOIN users ON comments.user_id = users.id
     WHERE comments.post_id = $1
     ORDER BY comments.created_at ASC`,
    [postId]
  );
  return result.rows;
};
module.exports = { insertPost, getAllPosts, insertLike, deleteLike, insertComment, getCommentsForPost };