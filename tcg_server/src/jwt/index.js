const jwt = require('jsonwebtoken');
const PRIVATEKEY = 'indecipherable';
// const { getOneUser } = require('../controllers/UserController');

const signToken = function (payload) {
  return jwt.sign(payload, PRIVATEKEY, { expiresIn: '24h' });
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

// const verifyAndGetUser = async function (token) {
//   try {
//     const decoded = jwt.verify(token, PRIVATEKEY);
//     const currentUser = await getOneUser({
//       userUUID: decoded.userUUID
//     });
//     return {
//       valid: true,
//       currentUser: currentUser
//     }
//   } catch(error) {
//     console.error(error);
//     return {
//       valid: false,
//       errorMessage: error
//     }
//   }
// };

module.exports = { signToken, verifyToken };