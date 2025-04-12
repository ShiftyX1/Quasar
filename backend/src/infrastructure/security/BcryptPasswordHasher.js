const bcrypt = require("bcrypt");
const settings = require("../../../config/settings");

class BcryptPasswordHasher {
  async hash(password) {
    return bcrypt.hash(password, settings.saltRounds);
  }

  async compare(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = BcryptPasswordHasher; 