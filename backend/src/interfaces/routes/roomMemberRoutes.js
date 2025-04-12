const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const RoomMemberController = require("../../application/controllers/RoomMemberController");
const JoinChatRoom = require("../../domain/usecases/chatroom/JoinChatRoom");
const ChatRoomRepositoryImpl = require("../../infrastructure/repositories/ChatRoomRepositoryImpl");
const RoomMemberRepositoryImpl = require("../../infrastructure/repositories/RoomMemberRepositoryImpl");

const chatRoomRepository = new ChatRoomRepositoryImpl();
const roomMemberRepository = new RoomMemberRepositoryImpl();
const joinChatRoomUseCase = new JoinChatRoom(chatRoomRepository, roomMemberRepository);

const roomMemberController = new RoomMemberController(joinChatRoomUseCase, roomMemberRepository);

router.post("/join", authMiddleware, (req, res, next) => roomMemberController.join(req, res, next));
router.delete("/:roomId", authMiddleware, (req, res, next) => roomMemberController.leave(req, res, next));
router.get("/joined", authMiddleware, (req, res, next) => roomMemberController.getJoinedRooms(req, res, next));
router.get("/room/:roomId", authMiddleware, (req, res, next) => roomMemberController.getRoomMembers(req, res, next));

module.exports = router; 