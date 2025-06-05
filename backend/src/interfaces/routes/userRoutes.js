const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const settings = require("../../../config/settings");

const UserController = require("../../application/controllers/UserController");
const RegisterUser = require("../../domain/usecases/user/RegisterUser");
const LoginUser = require("../../domain/usecases/user/LoginUser");
const LogoutUserUseCase = require("../../domain/usecases/user/LogoutUserUseCase");
const LogoutWithKeycloakUseCase = require("../../domain/usecases/user/LogoutWithKeycloakUseCase");
const GetCurrentUserUseCase = require("../../domain/usecases/user/GetCurrentUserUseCase");
const UpdateUserProfileUseCase = require("../../domain/usecases/user/UpdateUserProfileUseCase");

const UserRepositoryImpl = require("../../infrastructure/repositories/UserRepositoryImpl");
const BcryptPasswordHasher = require("../../infrastructure/security/BcryptPasswordHasher");
const JwtTokenGenerator = require("../../infrastructure/security/JwtTokenGenerator");
const KeycloakService = require("../../infrastructure/services/KeycloakService");
const TokenBlacklistService = require("../../infrastructure/services/TokenBlacklistService");

const userRepository = new UserRepositoryImpl();
const passwordHasher = new BcryptPasswordHasher();
const tokenGenerator = new JwtTokenGenerator();
const tokenBlacklistService = new TokenBlacklistService(settings.redis);

const registerUserUseCase = new RegisterUser(userRepository, passwordHasher, settings);
const loginUserUseCase = new LoginUser(userRepository, passwordHasher, tokenGenerator);
const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);

let logoutWithKeycloakUseCase = null;
if (settings.isKeycloakEnabled) {
  const keycloakService = new KeycloakService(settings.keycloak);
  logoutWithKeycloakUseCase = new LogoutWithKeycloakUseCase(keycloakService, settings);
}

const logoutUserUseCase = new LogoutUserUseCase(tokenBlacklistService, logoutWithKeycloakUseCase);

const userController = new UserController(
  registerUserUseCase, 
  loginUserUseCase,
  logoutUserUseCase,
  getCurrentUserUseCase,
  updateUserProfileUseCase
);

router.post("/register", (req, res, next) => userController.register(req, res, next));
router.post("/login", (req, res, next) => userController.login(req, res, next));
router.post("/logout", authMiddleware, (req, res) => userController.logout(req, res));
router.get("/me", authMiddleware, (req, res) => userController.getCurrentUser(req, res));
router.put("/profile", authMiddleware, (req, res) => userController.updateProfile(req, res));

module.exports = router; 