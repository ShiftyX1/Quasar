const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const settings = require("./config/settings");
const setupRoutes = require("./src/interfaces/routes");
const setupWebsockets = require("./src/infrastructure/websockets");
const { errorHandler } = require("./src/interfaces/middlewares/errorHandler");
const { setupDatabase } = require("./src/infrastructure/datasources/database");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: settings.clientUrl,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(helmet());
app.use(cors({ origin: settings.clientUrl, credentials: true }));
app.use(express.json());
app.use(cookieParser());

setupDatabase();
setupRoutes(app);
setupWebsockets(io);

app.use(errorHandler);

console.log(settings.clientUrl);

server.listen(settings.port, () => {
  console.log(`Server is running on port ${settings.port}`);
});
