const express = require('express');
const router = express.Router();

const settings = require('../../../config/settings');
const AuthController = require('../../application/controllers/AuthController');

const GetAuthConfigUseCase = require('../../domain/usecases/user/GetAuthConfigUseCase');
const GetKeycloakAuthUrlUseCase = require('../../domain/usecases/user/GetKeycloakAuthUrlUseCase');
const LoginWithKeycloakUseCase = require('../../domain/usecases/user/LoginWithKeycloakUseCase');
const CreateOrUpdateKeycloakUserUseCase = require('../../domain/usecases/user/CreateOrUpdateKeycloakUserUseCase');

const KeycloakService = require('../../infrastructure/services/KeycloakService');
const StateStorageService = require('../../infrastructure/services/StateStorageService');

const UserRepositoryImpl = require('../../infrastructure/repositories/UserRepositoryImpl');

const userRepository = new UserRepositoryImpl();

let keycloakService = null;
let stateStorageService = null;

if (settings.isKeycloakEnabled) {
  keycloakService = new KeycloakService(settings.keycloak);
  stateStorageService = new StateStorageService(settings.redis);
}

const getAuthConfigUseCase = new GetAuthConfigUseCase(settings);

let getKeycloakAuthUrlUseCase = null;
let loginWithKeycloakUseCase = null;

if (settings.isKeycloakEnabled) {
  const createOrUpdateKeycloakUserUseCase = new CreateOrUpdateKeycloakUserUseCase(userRepository);
  
  getKeycloakAuthUrlUseCase = new GetKeycloakAuthUrlUseCase(
    keycloakService, 
    stateStorageService, 
    settings
  );
  
  loginWithKeycloakUseCase = new LoginWithKeycloakUseCase(
    keycloakService,
    stateStorageService,
    createOrUpdateKeycloakUserUseCase,
    settings
  );
}

const authController = new AuthController(
  getAuthConfigUseCase,
  getKeycloakAuthUrlUseCase,
  loginWithKeycloakUseCase
);

const checkKeycloakEnabled = (req, res, next) => {
  if (!settings.isKeycloakEnabled) {
    return res.status(404).json({ 
      success: false,
      error: {
        code: 'SSO_NOT_AVAILABLE',
        message: 'SSO not available'
      }
    });
  }
  next();
};

// GET /api/auth/config - конфигурация аутентификации
router.get('/config', (req, res) => authController.getConfig(req, res));

// GET /api/auth/keycloak - инициация SSO (только если включен)
router.get('/keycloak', checkKeycloakEnabled, (req, res) => authController.initiateKeycloakAuth(req, res));

// GET /api/auth/keycloak/callback - обработка callback (только если включен)
router.get('/keycloak/callback', checkKeycloakEnabled, (req, res) => authController.handleKeycloakCallback(req, res));

module.exports = router; 