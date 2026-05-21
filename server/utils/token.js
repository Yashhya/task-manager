const jwt = require("jsonwebtoken");

/**
 * Generate JWT token with user ID
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { generateToken };
