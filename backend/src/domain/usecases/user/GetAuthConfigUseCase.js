/**
 * Use Case для получения конфигурации аутентификации
 */
class GetAuthConfigUseCase {
  constructor(settings) {
    this.settings = settings;
  }

  async execute() {
    const authMode = this.settings.authMode;
    
    return {
      keycloakEnabled: this.settings.isKeycloakEnabled,
      authMode: authMode,
      showLocalAuth: this._shouldShowLocalAuth(authMode),
      showSSOAuth: this._shouldShowSSOAuth(authMode),
      isLocalRegistrationAllowed: this.settings.isLocalRegistrationAllowed
    };
  }

  _shouldShowLocalAuth(authMode) {
    // Локальная аутентификация показывается в режимах local-only и hybrid
    return authMode === 'local-only' || authMode === 'hybrid';
  }

  _shouldShowSSOAuth(authMode) {
    // SSO аутентификация показывается в режимах hybrid и sso-only
    return authMode === 'hybrid' || authMode === 'sso-only';
  }
}

module.exports = GetAuthConfigUseCase; 