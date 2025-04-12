require("dotenv").config({ path: ".env.dev" });

class Settings {
  constructor() {
    this.port = process.env.BACKEND_PORT || 3000;
    this.clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    this.jwtSecret = process.env.JWT_SECRET || "your-secret-key";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";
    this.database = {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.DB_NAME || "chat_db",
      dialect: "postgres"
    };
    this.saltRounds = 10;
    this.cookie = {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 день
      sameSite: 'strict'
    };
  }
}

module.exports = new Settings();
