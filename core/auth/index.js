const jwt = require('jsonwebtoken');
const User = require('../../models/user');

// middleware to validate JWT token
const authMiddleware = async (req, res, next) => {
    try {
      // todo: token validation
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET ?? "lkjbhvgcfdtcftgywe6t76tyuy");
      const userId = decodedToken.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid token.' });
      }
      req.user = user;
      next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false,  message: 'Invalid token.' });
    }
  };

  module.exports = authMiddleware;