/**
 * Use Case для logout через Keycloak
 */
class LogoutWithKeycloakUseCase {
  constructor(keycloakService, settings) {
    this.keycloakService = keycloakService;
    this.settings = settings;
  }

  async execute(redirectUrl = null) {
    if (!this.settings.isKeycloakEnabled) {
      throw new Error('KEYCLOAK_DISABLED');
    }

    try {
      const logoutUrl = this.keycloakService.generateLogoutUrl(
        redirectUrl || `${this.settings.clientUrl}/auth`
      );

      console.log('KEYCLOAK_LOGOUT_INITIATED', { redirectUrl });

      return {
        logoutUrl
      };
    } catch (error) {
      console.error('Keycloak logout error:', error.message);
      throw new Error('KEYCLOAK_LOGOUT_FAILED');
    }
  }
}

module.exports = LogoutWithKeycloakUseCase; 