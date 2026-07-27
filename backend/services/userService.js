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

module.exports = { signup, login };