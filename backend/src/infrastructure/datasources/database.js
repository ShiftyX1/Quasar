const { Sequelize } = require("sequelize");
const config = require("./config/database.js");

// Используем настройки из конфигурации sequelize-cli для текущего окружения
const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging
  }
);

const setupDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    
    if (env === "development") {
      await sequelize.sync();
      console.log("All models were synchronized successfully.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  sequelize,
  setupDatabase
}; 