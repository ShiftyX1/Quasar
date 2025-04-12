const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const MessageController = require("../../application/controllers/MessageController");
const SendMessage = require("../../domain/usecases/message/SendMessage");
const GetRoomMessages = require("../../domain/usecases/message/GetRoomMessages");
const MessageRepositoryImpl = require("../../infrastructure/repositories/MessageRepositoryImpl");
const RoomMemberRepositoryImpl = require("../../infrastructure/repositories/RoomMemberRepositoryImpl");

const messageRepository = new MessageRepositoryImpl();
const roomMemberRepository = new RoomMemberRepositoryImpl();
const sendMessageUseCase = new SendMessage(messageRepository, roomMemberRepository);
const getRoomMessagesUseCase = new GetRoomMessages(messageRepository, roomMemberRepository);

const messageController = new MessageController(sendMessageUseCase, getRoomMessagesUseCase);

router.post("/", authMiddleware, (req, res, next) => messageController.sendMessage(req, res, next));
router.get("/room/:roomId", authMiddleware, (req, res, next) => messageController.getRoomMessages(req, res, next));

module.exports = router; 