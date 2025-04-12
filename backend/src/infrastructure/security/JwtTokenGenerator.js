const jwt = require("jsonwebtoken");
const settings = require("../../../config/settings");

class JwtTokenGenerator {
  generate(payload) {
    return jwt.sign(payload, settings.jwtSecret, { expiresIn: settings.jwtExpiresIn });
  }

  verify(token) {
    try {
      return jwt.verify(token, settings.jwtSecret);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtTokenGenerator; 