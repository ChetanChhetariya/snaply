const express = require('express');
const router = express.Router();
const { signup, login, followUser, unfollowUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');



router.post('/signup', signup);
router.post('/login', login);
router.post('/:userId/follow', authMiddleware, followUser);
router.delete('/:userId/follow', authMiddleware, unfollowUser);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
