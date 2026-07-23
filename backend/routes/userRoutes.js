const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');


router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

module.exports = router;
