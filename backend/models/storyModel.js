const pool = require('../config/db');

const insertStory = async (userId, imageUrl) => {
  const result = await pool.query(
    'INSERT INTO stories (user_id, image_url) VALUES ($1, $2) RETURNING *',
    [userId, imageUrl]
  );
  return result.rows[0];
};

const getActiveStories = async () => {
  const result = await pool.query(
    `SELECT stories.id, stories.image_url, stories.created_at,
            users.id AS user_id, users.username
     FROM stories
     JOIN users ON stories.user_id = users.id
     WHERE stories.created_at > NOW() - INTERVAL '24 hours'
     ORDER BY stories.created_at DESC`
  );
  return result.rows;
};

module.exports = { insertStory, getActiveStories };