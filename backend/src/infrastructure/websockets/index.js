const JwtTokenGenerator = require("../security/JwtTokenGenerator");
const tokenGenerator = new JwtTokenGenerator();
const UserRepositoryImpl = require("../repositories/UserRepositoryImpl");
const cookie = require('cookie');

const userRepository = new UserRepositoryImpl();

const setupWebsockets = (io) => {
  io.use(async (socket, next) => {
    
    let token;
    
    if (socket.handshake.headers.cookie) {
      const cookies = cookie.parse(socket.handshake.headers.cookie);
      token = cookies.auth_token;
    }
    
    if (!token && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    }
    
    if (!token) {
      return next(new Error("Authentication error"));
    }
    
    const decoded = tokenGenerator.verify(token);
    if (!decoded) {
      return next(new Error("Invalid token"));
    }
    
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return next(new Error("User not found"));
    }
    
    socket.user = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    
    next();
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.user.id})`);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.user.username} joined room ${roomId}`);
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room ${roomId}`);
    });

    socket.on("send-message", async (message) => {
      io.to(message.roomId).emit("new-message", {
        ...message,
        createdAt: new Date().toISOString(),
        user: {
          id: socket.user.id,
          username: socket.user.username
        }
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = setupWebsockets; 