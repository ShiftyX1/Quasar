const JwtTokenGenerator = require('../../../infrastructure/security/JwtTokenGenerator');

/**
 * Use Case для авторизации через Keycloak
 */
class LoginWithKeycloakUseCase {
  constructor(keycloakService, stateStorageService, createOrUpdateKeycloakUserUseCase, settings) {
    this.keycloakService = keycloakService;
    this.stateStorageService = stateStorageService;
    this.createOrUpdateKeycloakUserUseCase = createOrUpdateKeycloakUserUseCase;
    this.settings = settings;
    this.tokenGenerator = new JwtTokenGenerator();
  }

  async execute(code, state) {
    if (!this.settings.isKeycloakEnabled) {
      throw new Error('KEYCLOAK_DISABLED');
    }

    if (!code) {
      throw new Error('Missing authorization code');
    }
    if (!state) {
      throw new Error('Missing state parameter');
    }

    try {
      const stateData = await this.stateStorageService.retrieve(state);
      if (!stateData) {
        throw new Error('INVALID_STATE');
      }

      await this.stateStorageService.delete(state);

      const tokenResponse = await this.keycloakService.exchangeCodeForToken(code);
      if (!tokenResponse.access_token) {
        throw new Error('Failed to obtain access token');
      }

      const keycloakUserData = await this.keycloakService.getUserInfo(tokenResponse.access_token);

      const user = await this.createOrUpdateKeycloakUserUseCase.execute(keycloakUserData);

      console.log('KEYCLOAK_USER_FOR_TOKEN', {
        id: user.id,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider
      });

      const jwtToken = this.tokenGenerator.generate({
        id: user.id,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider
      });

      console.log('KEYCLOAK_AUTH_SUCCESS', { 
        userId: user.id, 
        authProvider: user.authProvider,
        externalId: user.externalId
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          authProvider: user.authProvider,
          createdAt: user.createdAt
        },
        token: jwtToken,
        redirectUrl: stateData.redirectUrl
      };
    } catch (error) {
      console.error('KEYCLOAK_LOGIN_ERROR', { 
        error: error.message, 
        code: code ? 'present' : 'missing',
        state: state ? 'present' : 'missing'
      });

      if (error.message === 'INVALID_STATE') {
        throw new Error('INVALID_STATE');
      }
      if (error.message === 'EMAIL_COLLISION') {
        throw new Error('AUTH_PROVIDER_MISMATCH');
      }

      throw new Error('KEYCLOAK_LOGIN_FAILED');
    }
  }
}

module.exports = LoginWithKeycloakUseCase; 