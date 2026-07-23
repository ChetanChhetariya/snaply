const express = require('express');
const router = express.Router();
const { createPost, getFeed } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/feed', authMiddleware, getFeed);

module.exports = router;