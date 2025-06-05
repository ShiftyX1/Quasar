const JwtTokenGenerator = require("../security/JwtTokenGenerator");
const tokenGenerator = new JwtTokenGenerator();
const UserRepositoryImpl = require("../repositories/UserRepositoryImpl");
const MessageRepositoryImpl = require("../repositories/MessageRepositoryImpl");
const RoomMemberRepositoryImpl = require("../repositories/RoomMemberRepositoryImpl");
const SendMessage = require("../../domain/usecases/message/SendMessage");
const cookie = require('cookie');

const userRepository = new UserRepositoryImpl();
const messageRepository = new MessageRepositoryImpl();
const roomMemberRepository = new RoomMemberRepositoryImpl();
const sendMessageUseCase = new SendMessage(messageRepository, roomMemberRepository);

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
      
      // Уведомляем других участников комнаты
      socket.to(roomId).emit("user-joined-room", {
        userId: socket.user.id,
        username: socket.user.username,
        roomId: roomId
      });
    });

    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log(`${socket.user.username} left room ${roomId}`);
      
      // Уведомляем других участников комнаты
      socket.to(roomId).emit("user-left-room", {
        userId: socket.user.id,
        username: socket.user.username,
        roomId: roomId
      });
    });

    socket.on("send-message", async (messageData) => {
      try {
        // Сохраняем сообщение в базу данных
        const savedMessage = await sendMessageUseCase.execute(
          messageData.content,
          socket.user.id,
          messageData.roomId
        );

        // Отправляем сообщение всем участникам комнаты (включая отправителя)
        io.to(messageData.roomId).emit("new-message", {
          id: savedMessage.id,
          content: savedMessage.content,
          userId: savedMessage.userId,
          roomId: savedMessage.roomId,
          createdAt: savedMessage.createdAt,
          user: {
            id: socket.user.id,
            username: socket.user.username,
            email: socket.user.email
          }
        });

        console.log(`Message sent by ${socket.user.username} in room ${messageData.roomId}`);
      } catch (error) {
        console.error("Error sending message:", error);
        
        // Отправляем ошибку обратно отправителю
        socket.emit("send-message-error", {
          error: error.message || "Failed to send message"
        });
      }
    });

    socket.on("start-typing", (data) => {
      socket.to(data.roomId).emit("user-typing", {
        userId: socket.user.id,
        username: socket.user.username,
        roomId: data.roomId
      });
    });

    socket.on("stop-typing", (data) => {
      socket.to(data.roomId).emit("user-stopped-typing", {
        userId: socket.user.id,
        roomId: data.roomId
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

module.exports = setupWebsockets; 