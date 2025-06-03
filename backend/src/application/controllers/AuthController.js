const settings = require("../../../config/settings");

/**
 * Контроллер для аутентификации (включая Keycloak SSO)
 */
class AuthController {
  constructor(getAuthConfigUseCase, getKeycloakAuthUrlUseCase, loginWithKeycloakUseCase) {
    this.getAuthConfigUseCase = getAuthConfigUseCase;
    this.getKeycloakAuthUrlUseCase = getKeycloakAuthUrlUseCase;
    this.loginWithKeycloakUseCase = loginWithKeycloakUseCase;
  }

  /**
   * GET /api/auth/config
   * Возвращает конфигурацию аутентификации для фронтенда
   */
  async getConfig(req, res) {
    try {
      const config = await this.getAuthConfigUseCase.execute();
      
      res.json({
        success: true,
        data: config
      });
    } catch (error) {
      console.error('Get auth config error:', error.message);
      res.status(500).json({
        success: false,
        error: {
          code: 'CONFIG_ERROR',
          message: 'Failed to get authentication configuration'
        }
      });
    }
  }

  /**
   * GET /api/auth/keycloak
   * Инициирует SSO flow через Keycloak
   */
  async initiateKeycloakAuth(req, res) {
    try {
      const { redirectUrl } = req.query;
      
      const result = await this.getKeycloakAuthUrlUseCase.execute(redirectUrl);
      
      res.redirect(result.authUrl);
    } catch (error) {
      console.error('Keycloak auth initiation error:', error.message);
      
      if (error.message === 'KEYCLOAK_DISABLED') {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SSO_NOT_AVAILABLE',
            message: 'SSO not available'
          }
        });
      }

      if (error.message === 'KEYCLOAK_UNAVAILABLE') {
        return res.status(503).json({
          success: false,
          error: {
            code: 'SSO_UNAVAILABLE',
            message: 'SSO service temporarily unavailable'
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'SSO_ERROR',
          message: 'Failed to initiate SSO authentication'
        }
      });
    }
  }

  /**
   * GET /api/auth/keycloak/callback
   * Обрабатывает callback от Keycloak
   */
  async handleKeycloakCallback(req, res) {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CALLBACK',
            message: 'Missing required parameters'
          }
        });
      }

      const result = await this.loginWithKeycloakUseCase.execute(code, state);
      
      res.cookie('auth_token', result.token, settings.cookie);
      res.redirect(result.redirectUrl || '/');
    } catch (error) {
      console.error('Keycloak callback error:', error.message);
      
      const errorMappings = {
        'KEYCLOAK_DISABLED': {
          status: 404,
          code: 'SSO_NOT_AVAILABLE',
          message: 'SSO not available'
        },
        'INVALID_STATE': {
          status: 400,
          code: 'INVALID_STATE',
          message: 'Invalid or expired authentication state'
        },
        'AUTH_PROVIDER_MISMATCH': {
          status: 409,
          code: 'EMAIL_COLLISION',
          message: 'Email already registered with different authentication method'
        }
      };

      const errorMapping = errorMappings[error.message];
      if (errorMapping) {
        return res.status(errorMapping.status).json({
          success: false,
          error: {
            code: errorMapping.code,
            message: errorMapping.message
          }
        });
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'SSO_LOGIN_FAILED',
          message: 'SSO authentication failed'
        }
      });
    }
  }
}

module.exports = AuthController; 