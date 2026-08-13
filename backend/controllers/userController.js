const userService = require('../services/userService');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await userService.signup(username, email, password);
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error.message);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await userService.login(email, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', ...result });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};
const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    await userService.followUser(followerId, followingId);
    res.status(201).json({ message: 'User followed' });
  } catch (error) {
    if (error.code === 'SELF_FOLLOW') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Already following this user' });
    }
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const followingId = req.params.userId;

    await userService.unfollowUser(followerId, followingId);
    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports = { signup, login, followUser, unfollowUser };