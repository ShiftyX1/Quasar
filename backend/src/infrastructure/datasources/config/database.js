require("dotenv").config({ path: process.cwd() + "/.env.dev" });

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "chatapp",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5435,
    dialect: "postgres",
    logging: false
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME_TEST || "chatapp_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5435,
    dialect: "postgres",
    logging: false
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false
  }
}; 