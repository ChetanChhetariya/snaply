const express = require('express');
const router = express.Router();
const { signup, login, followUser, unfollowUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/:userId/follow', authMiddleware, followUser);
router.delete('/:userId/follow', authMiddleware, unfollowUser);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});
router.get('/:userId/profile', authMiddleware, getUserProfile);

module.exports = router;