const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const logger = require('../logger/logger')(module);

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decode = jwt.verify(token, 'Bearer');
    const user = await User.findOne({
      _id: decode._id,
      'tokens.token': token,
    });
    if (!user) {
      logger.error('Invalid User');
      throw new Error('Invalid User');
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    logger.error('Please authenticate');
    res.status(401).send({
      error: 'Please authenticate',
    });
  }
};

module.exports = auth;
