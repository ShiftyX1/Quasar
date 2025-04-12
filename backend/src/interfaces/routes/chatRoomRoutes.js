const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const ChatRoomController = require("../../application/controllers/ChatRoomController");
const CreateChatRoom = require("../../domain/usecases/chatroom/CreateChatRoom");
const ChatRoomRepositoryImpl = require("../../infrastructure/repositories/ChatRoomRepositoryImpl");

const chatRoomRepository = new ChatRoomRepositoryImpl();
const createChatRoomUseCase = new CreateChatRoom(chatRoomRepository);

const chatRoomController = new ChatRoomController(createChatRoomUseCase, chatRoomRepository);

router.post("/", authMiddleware, (req, res, next) => chatRoomController.create(req, res, next));
router.get("/owned", authMiddleware, (req, res, next) => chatRoomController.getOwnedRooms(req, res, next));
router.get("/:id", authMiddleware, (req, res, next) => chatRoomController.getRoom(req, res, next));

module.exports = router; 