const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const UserController = require("../../application/controllers/UserController");
const RegisterUser = require("../../domain/usecases/user/RegisterUser");
const LoginUser = require("../../domain/usecases/user/LoginUser");
const UserRepositoryImpl = require("../../infrastructure/repositories/UserRepositoryImpl");
const BcryptPasswordHasher = require("../../infrastructure/security/BcryptPasswordHasher");
const JwtTokenGenerator = require("../../infrastructure/security/JwtTokenGenerator");

const userRepository = new UserRepositoryImpl();
const passwordHasher = new BcryptPasswordHasher();
const tokenGenerator = new JwtTokenGenerator();

const registerUserUseCase = new RegisterUser(userRepository, passwordHasher);
const loginUserUseCase = new LoginUser(userRepository, passwordHasher, tokenGenerator);

const userController = new UserController(registerUserUseCase, loginUserUseCase);

router.post("/register", (req, res, next) => userController.register(req, res, next));
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/logout", (req, res) => userController.logout(req, res));
router.get("/me", authMiddleware, (req, res) => userController.getCurrentUser(req, res));

module.exports = router; 