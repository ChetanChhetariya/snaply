const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  followUser,
  unfollowUser,
  getUserProfile,
  togglePrivacy,
  getPendingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/:userId/follow', authMiddleware, followUser);
router.delete('/:userId/follow', authMiddleware, unfollowUser);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});
router.get('/:userId/profile', authMiddleware, getUserProfile);
router.patch('/privacy', authMiddleware, togglePrivacy);
router.get('/requests/pending', authMiddleware, getPendingRequests);
router.post('/requests/:followerId/accept', authMiddleware, acceptFollowRequest);
router.post('/requests/:followerId/reject', authMiddleware, rejectFollowRequest);

module.exports = router;