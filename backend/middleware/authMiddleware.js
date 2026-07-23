const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Step 1: Get the token from the request headers
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided, access denied' });
  }

  const token = authHeader.split(' ')[1]; // "Bearer <token>" -> just the token part

  try {
    // Step 2: Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 3: Attach the user info to the request, so later routes can use it
    req.user = decoded; // contains userId and username

    next(); // move on to the actual route
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;