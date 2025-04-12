const userRoutes = require("./userRoutes");
const chatRoomRoutes = require("./chatRoomRoutes");
const messageRoutes = require("./messageRoutes");
const roomMemberRoutes = require("./roomMemberRoutes");

const setupRoutes = (app) => {
  app.use("/api/users", userRoutes);
  app.use("/api/rooms", chatRoomRoutes);
  app.use("/api/messages", messageRoutes);
  app.use("/api/memberships", roomMemberRoutes);
  
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });
};

module.exports = setupRoutes; 