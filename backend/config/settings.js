require("dotenv").config({ path: ".env.dev" });

class Settings {
  constructor() {
    this.port = process.env.BACKEND_PORT || 3000;
  }
}

module.exports = new Settings();
