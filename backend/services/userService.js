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

  const isPrivate = await userModel.getPrivacyStatus(followingId);
  const status = isPrivate ? 'pending' : 'accepted';

  await userModel.insertFollow(followerId, followingId, status);
  return { status };
};

const unfollowUser = async (followerId, followingId) => {
  return await userModel.deleteFollow(followerId, followingId);
};

const getUserProfile = async (userId, currentUserId) => {
  const profile = await userModel.getUserProfile(userId);
  if (!profile) return null;

  const isOwnProfile = Number(userId) === Number(currentUserId);
  const followStatus = await userModel.getFollowStatus(currentUserId, userId);
  const isPrivate = await userModel.getPrivacyStatus(userId);
  const followedByMe = followStatus === 'accepted';

  const canViewPosts = isOwnProfile || !isPrivate || followedByMe;

  return {
    ...profile,
    posts: canViewPosts ? profile.posts : [],
    is_own_profile: isOwnProfile,
    followed_by_me: followedByMe,
    follow_status: followStatus,
    is_private: isPrivate,
    can_view_posts: canViewPosts,
  };
};

const setPrivacy = async (userId, isPrivate) => {
  return await userModel.setPrivacy(userId, isPrivate);
};

const getPendingRequests = async (userId) => {
  return await userModel.getPendingRequests(userId);
};

const acceptFollowRequest = async (userId, requesterId) => {
  return await userModel.acceptFollowRequest(requesterId, userId);
};

const rejectFollowRequest = async (userId, requesterId) => {
  return await userModel.rejectFollowRequest(requesterId, userId);
};

module.exports = {
  signup,
  login,
  followUser,
  unfollowUser,
  getUserProfile,
  setPrivacy,
  getPendingRequests,
  acceptFollowRequest,
  rejectFollowRequest,
};