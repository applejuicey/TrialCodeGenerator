const jwt = require('jsonwebtoken');
const PRIVATEKEY = 'indecipherable';

const signToken = function (payload) {
  return jwt.sign(payload, PRIVATEKEY, { expiresIn: '1h' });
};

const verifyToken = function (token) {
  return jwt.verify(token, PRIVATEKEY, (error, decoded) => {
    if (error) {
      return {
        valid: false,
        errorMessage: error.message
      }
    }
    return {
      valid: true,
      decoded: decoded
    }
  })
};

module.exports = { signToken, verifyToken };