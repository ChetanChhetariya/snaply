const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const signup = async (username, email, password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  return await userModel.insertUser(username, email, passwordHash);
};

const login = async (email, password) => {
  const user = await userModel.findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return null;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};
const followUser = async (followerId, followingId) => {
  if (Number(followerId) === Number(followingId)) {
    const error = new Error('You cannot follow yourself');
    error.code = 'SELF_FOLLOW';
    throw error;
  }
  return await userModel.insertFollow(followerId, followingId);
};

const unfollowUser = async (followerId, followingId) => {
  return await userModel.deleteFollow(followerId, followingId);
};

const getUserProfile = async (userId, currentUserId) => {
  const profile = await userModel.getUserProfile(userId);
  if (!profile) return null;

  const followers = await userModel.isFollowing(currentUserId, userId);

  return {
    ...profile,
    is_own_profile: Number(userId) === Number(currentUserId),
    followed_by_me: followers,
  };
};

module.exports = { signup, login, followUser, unfollowUser, getUserProfile };