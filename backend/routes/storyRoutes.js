const express = require('express');
const router = express.Router();
const { createStory, getStories } = require('../controllers/storyController');
const authMiddleware = require('../middleware/authmiddleware');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), createStory);
router.get('/', authMiddleware, getStories);

module.exports = router;