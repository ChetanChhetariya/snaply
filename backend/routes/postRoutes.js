const express = require('express');
const router = express.Router();
const { createPost, getFeed, likePost, unlikePost } = require('../controllers/postController');
const { addComment, getComments } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/feed', authMiddleware, getFeed);
router.post('/:postId/like', authMiddleware, likePost);
router.delete('/:postId/like', authMiddleware, unlikePost);
router.post('/:postId/comments', authMiddleware, addComment);
router.get('/:postId/comments', authMiddleware, getComments);

module.exports = router;