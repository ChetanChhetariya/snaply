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

    const result = await userService.followUser(followerId, followingId);

    if (result.status === 'pending') {
      return res.status(201).json({ message: 'Follow request sent', status: 'pending' });
    }
    res.status(201).json({ message: 'User followed', status: 'accepted' });
  } catch (error) {
    if (error.code === 'SELF_FOLLOW') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Already following or requested' });
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

const getUserProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.params.userId, req.user.userId);

    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const togglePrivacy = async (req, res) => {
  try {
    const { is_private } = req.body;
    await userService.setPrivacy(req.user.userId, is_private);
    res.status(200).json({ message: 'Privacy setting updated', is_private });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await userService.getPendingRequests(req.user.userId);
    res.status(200).json({ requests });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const acceptFollowRequest = async (req, res) => {
  try {
    await userService.acceptFollowRequest(req.user.userId, req.params.followerId);
    res.status(200).json({ message: 'Follow request accepted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

const rejectFollowRequest = async (req, res) => {
  try {
    await userService.rejectFollowRequest(req.user.userId, req.params.followerId);
    res.status(200).json({ message: 'Follow request rejected' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error, please try again' });
  }
};

module.exports = {
  signup,
  login,
  followUser,
  unfollowUser,
  getUserProfile,
  togglePrivacy,
  getPendingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
};