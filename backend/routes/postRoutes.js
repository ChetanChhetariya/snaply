const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// POST /api/posts  -> create a new post
router.post('/', authMiddleware, upload.single('image'), createPost);

module.exports = router;